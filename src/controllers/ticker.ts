import { bignumber } from 'mathjs'
import { getSummaryTickerData } from '../models/summary.model'

interface TickerItem {
  base_symbol: string
  quote_symbol: string
  base_id: string
  quote_id: string
  isFrozen: boolean
  last_price: number
  last_price_base: number
  base_volume: number
  quote_volume: number
}

export async function getTickerData (): Promise<{ [key: string]: TickerItem }> {
  const output: { [key: string]: TickerItem } = {}
  const result = await getSummaryTickerData()
  result.forEach((item) => {
    const updatedSinceYesterday =
      new Date(item.summary_updatedAt).getTime() >
      new Date().getTime() - 24 * 60 * 60 * 1000
    const k = `${item.summary_baseId}_${item.summary_quoteId}`
    output[k] = {
      base_symbol: item.summary_baseSymbol,
      base_id: item.summary_baseId,
      quote_symbol: item.summary_quoteSymbol,
      quote_id: item.summary_quoteId,
      isFrozen: !updatedSinceYesterday,
      last_price: Number(item.summary_lastPrice),
      last_price_base: Number(
        bignumber(1).div(item.summary_lastPrice).toFixed(18)
      ),
      base_volume: Number(item.summary_baseVolume24h),
      quote_volume: Number(item.summary_quoteVolume24h)
    }
  })
  return output
}
