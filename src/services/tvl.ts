import { getQuery } from '../utils/apolloClient'
import {
  liquidityPoolContracts,
  lendingPoolContracts,
  protocolTokens
} from '../graphQueries/tvlContracts'
import { abiErc20 } from '@blobfishkate/sovryncontractswip'
import { createContract, addresses } from '../utils/web3Provider'
import { LendingPool, ProtocolStats, Token } from '../../generated-schema'
import math, { bignumber } from 'mathjs'
import { isNil } from 'lodash'
import { createTvlRow } from '../models/tvl.model'
import log from '../logger'
import { updateLiquidityColumn } from '../models/summary.model'

const logger = log.logger.child({ module: 'TVL Service' })

interface Prices {
  [key: string]: {
    btc: string
    usd: string
  }
}

export enum TvlGroup {
  AMM = 'tvlAmm',
  Lending = 'tvlLending',
  Protocol = 'tvlProtocol',
  Subprotocol = 'tvlSubprotocols',
  Staking = 'tvlStaking',
}

export interface ITvl {
  contract: string
  asset: string
  /** Name follows the convention of ASSET_Contract */
  name: string
  balance: string
  balanceUsd: string
  balanceBtc: string
  tvlGroup: TvlGroup
}

export default async function main (): Promise<void> {
  logger.info('Running TVL scheduled task')
  const data = await getQuery(protocolTokens)
  const protocolData: ProtocolStats = data.protocolStats
  const tokenData = protocolData.tokens
  const prices: Prices = {}
  tokenData.forEach((item) => {
    prices[item.id] = {
      btc: item.lastPriceBtc,
      usd: item.lastPriceUsd
    }
  })
  await getAmmPoolTvl(prices)
  await getLendingPoolTvl(prices)
  await getProtocolTvl(tokenData)
  await getStakingTvl(tokenData)
  await getSubprotocolTvl(tokenData)
  logger.info('TVL scheduled task complete')
}

/**
 * AMM Tvl
 * Lending Tvl
 * Protocol Tvl
 * Subprotocol Tvl - get SOV balance of all subprotocol reserves
 * Staking Tvl
 */

async function getStakingTvl (tokens: Token[]): Promise<void> {
  const sovToken = tokens.find((item) => item.symbol === 'SOV')
  if (!isNil(sovToken)) {
    const balance = await getAssetBalance(
      sovToken.id,
      addresses.staking.toLowerCase()
    )
    if (!isNil(balance) && balance.greaterThan(0)) {
      const usdBalance = bignumber(balance)
        .mul(sovToken.lastPriceUsd)
        .toFixed(2)
      const btcBalance = bignumber(balance)
        .mul(sovToken.lastPriceBtc)
        .toFixed(18)
      const output: ITvl = {
        contract: addresses.staking.toLowerCase(),
        asset: sovToken.id,
        name: 'SOV_Staking',
        balance: balance.toFixed(18),
        balanceBtc: btcBalance,
        balanceUsd: usdBalance,
        tvlGroup: TvlGroup.Staking
      }
      console.log(output)
      await createTvlRow(output)
      logger.info('TVL rows added for staking contract')
    } else {
      throw new Error('Balance is 0 for Staking contract')
    }
  } else {
    throw new Error('SOV token not found')
  }
}

async function getProtocolTvl (tokens: Token[]): Promise<void> {
  for (const token of tokens) {
    const balance = await getAssetBalance(token.id, addresses.Protocol)
    if (!isNil(balance) && balance.greaterThan(0)) {
      const usdBalance = bignumber(balance).mul(token.lastPriceUsd).toFixed(2)
      const btcBalance = bignumber(balance).mul(token.lastPriceBtc).toFixed(18)
      const output: ITvl = {
        contract: addresses.Protocol.toLowerCase(),
        asset: token.id,
        name: `${!isNil(token.symbol) ? token.symbol : ''}_Protocol`,
        balance: balance.toFixed(18),
        balanceBtc: btcBalance,
        balanceUsd: usdBalance,
        tvlGroup: TvlGroup.Protocol
      }
      await createTvlRow(output)
    }
  }
  logger.info('TVL rows added for protocol contract')
}

async function getLendingPoolTvl (prices: Prices): Promise<void> {
  const data = await getQuery(lendingPoolContracts)
  const contracts: LendingPool[] = data.lendingPools
  for (const contract of contracts) {
    const balance = await getAssetBalance(
      contract.underlyingAsset.id,
      contract.id
    )
    if (!isNil(balance) && balance.greaterThan(0)) {
      const tokenPrices = prices[contract.underlyingAsset.id]
      const usdBalance = bignumber(balance).mul(tokenPrices.usd).toFixed(2)
      const btcBalance = bignumber(balance).mul(tokenPrices.btc).toFixed(18)
      const output: ITvl = {
        contract: contract.id,
        asset: contract.underlyingAsset.id,
        name: `${
          !isNil(contract.underlyingAsset.symbol)
            ? contract.underlyingAsset.symbol
            : ''
        }_Lending`,
        balance: balance.toFixed(18),
        balanceBtc: btcBalance,
        balanceUsd: usdBalance,
        tvlGroup: TvlGroup.Lending
      }
      await createTvlRow(output)
    }
  }
  logger.info('TVL rows added for lending contracts')
}

async function getAmmPoolTvl (prices: Prices): Promise<void> {
  const data = await getQuery(liquidityPoolContracts)
  const contracts = data.liquidityPools

  for (const contract of contracts) {
    const balances: { [key: string]: number } = {}
    for (let i = 0; i < 2; i++) {
      const balance = await getAssetBalance(
        contract[`token${i}`].id,
        contract.id
      )
      if (!isNil(balance) && balance.greaterThan(0)) {
        balances[contract[`token${i}`].id] = Number(balance.toFixed(18))
        const tokenIteratorSymbol: string = !isNil(contract[`token${i}`].symbol)
          ? contract[`token${i}`].symbol
          : ''
        const token1Symbol: string = !isNil(contract.token1.symbol)
          ? contract.token1.symbol
          : ''
        const tokenPrices = prices[contract[`token${i}`].id]
        const usdBalance = bignumber(balance).mul(tokenPrices.usd).toFixed(2)
        const btcBalance = bignumber(balance).mul(tokenPrices.btc).toFixed(18)
        const output: ITvl = {
          contract: contract.id,
          asset: contract[`token${i}`].id,
          name: `${tokenIteratorSymbol}_${token1Symbol}`,
          balance: balance.toFixed(18),
          balanceBtc: btcBalance,
          balanceUsd: usdBalance,
          tvlGroup: TvlGroup.AMM
        }
        await createTvlRow(output)
      }
      /** Update liquidity fields in Summary */
      await updateLiquidityColumn({
        contract: contract.id,
        balances: balances
      })
    }
  }
  logger.info('TVL rows added for amm contracts')
}

async function getSubprotocolTvl (tokens: Token[]): Promise<void> {
  const sovToken = tokens.find((item) => item.symbol === 'SOV')
  const subprotocolReserves = Object.entries(addresses)
    .filter((item) => item[0].includes('_subreserve'))
    .map((item) => {
      return {
        contract: item[1].toLowerCase(),
        protocol: item[0].slice(0, item[0].indexOf('_')).toUpperCase()
      }
    })
  for (const contract of subprotocolReserves) {
    if (!isNil(sovToken)) {
      const balance = await getAssetBalance(sovToken.id, contract.contract)
      if (!isNil(balance) && balance.greaterThan(0)) {
        const usdBalance = bignumber(balance)
          .mul(sovToken.lastPriceUsd)
          .toFixed(2)
        const btcBalance = bignumber(balance)
          .mul(sovToken.lastPriceBtc)
          .toFixed(18)
        const output: ITvl = {
          contract: contract.contract,
          asset: sovToken.id,
          name: `SOV_${contract.protocol}`,
          balance: balance.toFixed(18),
          balanceBtc: btcBalance,
          balanceUsd: usdBalance,
          tvlGroup: TvlGroup.Subprotocol
        }
        await createTvlRow(output)
      }
    }
    logger.info('TVL rows added for subprotocol contracts')
  }
}

async function getAssetBalance (
  token: string,
  contract: string
): Promise<math.BigNumber | undefined> {
  const erc20Contract = createContract(abiErc20, token)
  let balance: math.BigNumber
  try {
    balance = await erc20Contract.methods.balanceOf(contract).call()
    return bignumber(balance).div(1e18)
  } catch (e) {
    const error = e as Error
    logger.error(`Error getting balance for: ${token}`, error.message)
    return undefined
  }
}

// main();
