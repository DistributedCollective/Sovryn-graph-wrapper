import { addresses } from '../../utils/web3Provider'
import { Token } from '../../generated-schema'
import { bignumber } from 'mathjs'
import { isNil } from 'lodash'
import { createTvlRow } from '../../models/tvl.model'
import { getAssetBalance, TvlGroup, ITvl } from '../tvl.service'
import { Logger } from 'pino'

export async function getSubprotocolTvl (
  tokens: Token[],
  logger: Logger
): Promise<void> {
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
