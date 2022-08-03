import { addresses } from '../../utils/web3Provider'
import { Token } from '../../generated-schema'
import { bignumber } from 'mathjs'
import { isNil } from 'lodash'
import { createTvlRow } from '../../models/tvl.model'
import config from '../../config/config'
import { getAssetBalance, TvlGroup, ITvl } from '../tvl.service'
import { Logger } from 'pino'

export async function getStakingTvl (
  tokens: Token[],
  logger: Logger
): Promise<void> {
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
      await createTvlRow(output)
      logger.info('TVL rows added for staking contract')
    } else {
      throw new Error(
        `Balance is 0 for Staking contract: ${addresses.staking.toLowerCase()} : ${
          sovToken.id
        } : ${config.env}`
      )
    }
  } else {
    throw new Error('SOV token not found')
  }
}
