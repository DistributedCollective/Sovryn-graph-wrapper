import { getSummaryTickerData } from '../models/summary.model'
import { inversePrice } from '../utils/helpers'

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
    const millisecondsInADay = 24 * 60 * 60 * 1000
    const updatedSinceYesterday =
      new Date(item.updatedAt).getTime() >
      new Date().getTime() - millisecondsInADay
    const k = `${item.baseId}_${item.quoteId}`
    output[k] = {
      base_symbol: item.baseSymbol,
      base_id: item.baseId,
      quote_symbol: item.quoteSymbol,
      quote_id: item.quoteId,
      isFrozen: !updatedSinceYesterday,
      last_price: Number(item.lastPrice),
      last_price_base: inversePrice(item.lastPrice, 18),
      base_volume: Number(item.baseVolume24h),
      quote_volume: Number(item.quoteVolume24h)
    }
  })
  return output
}
