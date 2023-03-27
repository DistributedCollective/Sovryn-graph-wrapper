import { getQuery } from '../utils/apolloClient'
import { protocolTokens } from '../graphQueries/tvlContracts'
import { abiErc20 } from '@blobfishkate/sovryncontractswip'
import { createContract } from '../utils/web3Provider'
import { ProtocolStats } from '../generated-schema'
import math, { bignumber } from 'mathjs'
import log from '../logger'
import { getProtocolTvl } from './tvlSections/protocol'
import { getLendingPoolTvl } from './tvlSections/lending'
import { getStakingTvl } from './tvlSections/staking'
import { getAmmPoolTvl } from './tvlSections/amm'
import { getSubprotocolTvl } from './tvlSections/subprotocol'
import { getZeroTvl } from './tvlSections/zero'
import { getMyntTvl } from './tvlSections/mynt'

const logger = log.logger.child({ module: 'TVL Service' })

export interface Prices {
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
  Zero = 'tvlZero',
  Mynt = 'tvlMynt'
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
  await getAmmPoolTvl(prices, logger)
  await getLendingPoolTvl(prices, logger)
  await getProtocolTvl(tokenData, logger)
  await getStakingTvl(tokenData, logger)
  await getSubprotocolTvl(tokenData, logger)
  await getZeroTvl(tokenData, logger)
  await getMyntTvl(tokenData, logger)
  logger.info('TVL scheduled task complete')
}

export async function getAssetBalance (
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
