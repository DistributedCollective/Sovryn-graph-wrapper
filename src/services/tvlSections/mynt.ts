import { isNil } from 'lodash'
import { bignumber } from 'mathjs'
import { Logger } from 'pino'
import { Token } from '../../generated-schema'
import { createTvlRow } from '../../models/tvl.model'
import { addresses } from '../../utils/web3Provider'
import { getAssetBalance, ITvl, TvlGroup } from '../tvl.service'

export async function getMyntTvl (
  tokens: Token[],
  logger: Logger
): Promise<void> {
  const myntAggregator = addresses.myntAggregator.toLowerCase()
  const zusdToken = addresses.ZUSD.toLowerCase()
  const symbols = ['DOC']
  const myntTokens = tokens.filter(
    (item) => !isNil(item.symbol) && symbols.includes(item.symbol)
  )
  const DLLR = tokens.find((item) => item.symbol === 'DLLR')
  /** Add ZUSD to list of mynt tokens because it does not exist on the subgraph. The price of ZUSD will be the same as DLLR */
  if (!isNil(DLLR)) {
    const ZUSD = {
      ...DLLR,
      symbol: 'ZUSD',
      id: zusdToken
    }
    myntTokens.push(ZUSD)
  }

  for (const token of myntTokens) {
    const balance = await getAssetBalance(token.id, myntAggregator)
    if (!isNil(balance)) {
      const usdBalance = bignumber(balance).mul(token.lastPriceUsd).toFixed(2)
      const btcBalance = bignumber(balance).mul(token.lastPriceBtc).toFixed(18)
      const output: ITvl = {
        contract: myntAggregator,
        asset: token.id,
        name: `${!isNil(token.symbol) ? token.symbol : ''}_Mynt`,
        balance: balance.toFixed(18),
        balanceBtc: btcBalance,
        balanceUsd: usdBalance,
        tvlGroup: TvlGroup.Mynt
      }
      await createTvlRow(output)
    }
  }
  logger.info('Mynt rows added for protocol contract')
}
