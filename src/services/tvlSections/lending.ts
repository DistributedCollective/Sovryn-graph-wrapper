import { getAssetBalance, ITvl, TvlGroup, Prices } from '../tvl.service'
import { getQuery } from '../../utils/apolloClient'
import { lendingPoolContracts } from '../../graphQueries/tvlContracts'
import { LendingPool } from '../../generated-schema'
import { bignumber } from 'mathjs'
import { isNil } from 'lodash'
import { createTvlRow } from '../../models/tvl.model'
import { Logger } from 'pino'

export async function getLendingPoolTvl (
  prices: Prices,
  logger: Logger
): Promise<void> {
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
