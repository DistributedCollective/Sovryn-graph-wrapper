import { addresses, createContract } from '../../utils/web3Provider'
import {
  abiStabilityPool,
  abiTroveManager
} from '@blobfishkate/sovryncontractswip'
import { Token } from '../../generated-schema'
import { bignumber } from 'mathjs'
import { isNil } from 'lodash'
import { createTvlRow } from '../../models/tvl.model'
import { TvlGroup, ITvl } from '../tvl.service'
import { Logger } from 'pino'

export async function getZeroTvl (
  tokens: Token[],
  logger: Logger
): Promise<void> {
  const btcToken = tokens.find((item) => item.symbol === 'WRBTC')
  const btcPrice = btcToken?.lastPriceUsd
  if (!isNil(btcPrice)) {
    const stabilityPoolTvl = await getStabilityPoolTvl(btcPrice)
    await createTvlRow(stabilityPoolTvl)
    const troveManagerTvl = await getTroveManagerTvl(btcPrice)
    await createTvlRow(troveManagerTvl)
    logger.info('TVL rows added for Zero contracts')
  } else {
    throw new Error('Could not get Zero TVL because btcPrice is undefined')
  }
}

async function getTroveManagerTvl (btcPrice: string): Promise<ITvl> {
  try {
    const troveManagerContract = createContract(
      abiTroveManager,
      addresses.troveManager
    )
    const zusdDeposits = await troveManagerContract.methods
      .getEntireSystemColl()
      .call()
    const balance = bignumber(zusdDeposits).div(1e18)
    const output: ITvl = {
      contract: addresses.stabilityPool,
      // asset: addresses.zusd_token,
      asset: addresses.SOV_token,
      name: 'ZUSD_Zero',
      balance: balance.toFixed(18),
      balanceBtc: balance.toFixed(18),
      balanceUsd: balance.mul(btcPrice).toFixed(2),
      tvlGroup: TvlGroup.Zero
    }
    return output
  } catch (e) {
    const error = e as Error
    throw new Error(error.message)
  }
  /** Total collateral is RBTC balance on active pool */
}

async function getStabilityPoolTvl (btcPrice: string): Promise<ITvl> {
  try {
    const stabilityPoolContract = createContract(
      abiStabilityPool,
      addresses.stabilityPool
    )
    const zusdDeposits = await stabilityPoolContract.methods
      .getTotalZUSDDeposits()
      .call()
    const balance = bignumber(zusdDeposits).div(1e18)
    const output: ITvl = {
      contract: addresses.stabilityPool,
      // asset: addresses.zusd_token,
      asset: addresses.SOV_token,
      name: 'ZUSD_Zero',
      balance: balance.toFixed(18),
      balanceBtc: balance.div(btcPrice).toFixed(18),
      balanceUsd: balance.toFixed(2),
      tvlGroup: TvlGroup.Zero
    }
    return output
  } catch (e) {
    const error = e as Error
    throw new Error(error.message)
  }
}
