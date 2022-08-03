import { getQuery } from '../../utils/apolloClient'
import { liquidityPoolContracts } from '../../graphQueries/tvlContracts'
import { bignumber } from 'mathjs'
import { isNil } from 'lodash'
import { createTvlRow } from '../../models/tvl.model'
import { updateLiquidityColumn } from '../../models/summary.model'
import { Prices, getAssetBalance, TvlGroup, ITvl } from '../tvl.service'
import { Logger } from 'pino'

/** TODO: This can now use contract balances from the graph */
export async function getAmmPoolTvl (
  prices: Prices,
  logger: Logger
): Promise<void> {
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
