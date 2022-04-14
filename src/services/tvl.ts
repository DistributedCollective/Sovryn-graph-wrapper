import { getQuery } from '../utils/apolloClient'
import {
  liquidityPoolContracts,
  lendingPoolContracts,
  protocolTokens
} from '../graphQueries/tvlContracts'
import { abiErc20 } from '@blobfishkate/sovryncontractswip'
import { createContract, addresses } from '../utils/web3Provider'
import { ProtocolStats, Token } from '../../generated-schema'
import math, { bignumber } from 'mathjs'
import { isNil } from 'lodash'
import { createTvlRow } from '../models/tvl.model'
import log from '../logger'

const logger = log.logger.child({ module: 'TVL Service' })

interface Prices {
  [key: string]: {
    btc: string
    usd: string
  }
}

export enum TvlGroup {
  AMM = 'AMM',
  Lending = 'Lending',
  Protocol = 'Protocol',
  Subprotocol = 'Subprotocol',
  Staking = 'Staking',
}

export interface ITvl {
  contract: string
  asset: string
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
        .mul(sovToken.lastPriceUsd)
        .toFixed(18)
      const output: ITvl = {
        contract: addresses.staking.toLowerCase(),
        asset: sovToken.id,
        name: 'Staking',
        balance: balance.toFixed(18),
        balanceBtc: btcBalance,
        balanceUsd: usdBalance,
        tvlGroup: TvlGroup.Staking
      }
      await createTvlRow(output)
      logger.info('TVL rows added for staking contract')
    }
  }
}

async function getProtocolTvl (tokens: Token[]): Promise<void> {
  for (const token of tokens) {
    const balance = await getAssetBalance(token.id, addresses.Protocol)
    if (!isNil(balance) && balance.greaterThan(0)) {
      const usdBalance = bignumber(balance).mul(token.lastPriceUsd).toFixed(2)
      const btcBalance = bignumber(balance).mul(token.lastPriceUsd).toFixed(18)
      const output: ITvl = {
        contract: addresses.Protocol.toLowerCase(),
        asset: token.id,
        name: `Protocol_${!isNil(token.symbol) ? token.symbol : ''}`,
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
  const contracts = data.lendingPools
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
        name: contract.underlyingAsset.symbol,
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
    for (let i = 0; i < 2; i++) {
      const balance = await getAssetBalance(
        contract[`token${i}`].id,
        contract.id
      )
      if (!isNil(balance) && balance.greaterThan(0)) {
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
    }
  }
  logger.info('TVL rows added for amm contracts')
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
