import { getAllSummaryPairData } from '../models/summary.model'
import { Summary } from '../utils/interfaces'
import config from '../config/config'
import { inversePrice } from '../utils/helpers'

export const getSummaryData = async (): Promise<Summary> => {
  const data = await getAllSummaryPairData()
  const pairs: { [key: string]: any } = {}
  let btcPrice = 0
  let totalVolumeBtc = 0
  data.forEach((item) => {
    if (item.baseSymbol === config.stableCoinSymbol) {
      btcPrice = inversePrice(item.lastPrice, 2)
    }
    totalVolumeBtc += Number(item.quoteVolume24h)
    const pair = `${item.baseId}_${item.quoteId}`
    pairs[pair] = {
      trading_pairs: pair,
      base_symbol: item.baseSymbol,
      base_id: item.baseId,
      quote_symbol: item.quoteSymbol,
      quote_id: item.quoteId,
      base_volume: Number(item.baseVolume24h),
      quote_volume: Number(item.quoteVolume24h),
      last_price: Number(item.lastPrice),
      last_price_usd: Number(item.lastPriceUsd),
      high_price_24h: Number(item.highBtc),
      high_price_24h_usd: Number(item.highUsd),
      lowest_price_24h: Number(item.lowBtc),
      lowest_price_24h_usd: Number(item.lowUsd),
      price_change_percent_24h: Number(item.priceChangePercent24h),
      price_change_percent_24h_usd: Number(item.priceChangePercent24hUsd),
      price_change_week: Number(item.priceChangePercentWeek),
      price_change_week_usd: Number(item.priceChangePercentWeekUsd)
    }
  })

  return {
    pairs: pairs,
    updated_at: data[0].updatedAt,
    total_volume_btc: totalVolumeBtc,
    total_volume_usd: totalVolumeBtc * btcPrice
  }
}
