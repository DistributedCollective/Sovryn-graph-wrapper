import { addresses } from '../../utils/web3Provider'
import { Token } from '../../generated-schema'
import { bignumber } from 'mathjs'
import { isNil } from 'lodash'
import { createTvlRow } from '../../models/tvl.model'
import { getAssetBalance, ITvl, TvlGroup } from '../tvl.service'
import { Logger } from 'pino'

export async function getProtocolTvl (
  tokens: Token[],
  logger: Logger
): Promise<void> {
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
