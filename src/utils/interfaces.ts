interface TradingPairDataItem {
  trading_pairs: string
  base_symbol: string
  base_symbol_legacy: string
  base_id: string
  quote_symbol: string
  quote_symbol_legacy: String
  quote_id: string
  base_volume: number
  quote_volume: number
  last_price: number
  last_price_usd: number
  high_price_24h: number
  high_price_24h_usd: number
  lowest_price_24h: number
  lowest_price_24h_usd: number
  price_change_percent_24h: number
  price_change_percent_24h_usd: number
  price_change_week: number
  price_change_week_usd: number
  day_price: number
}

export interface ITradingPairDataBase {
  poolId: string
  baseSymbol: string
  baseId: string
  quoteSymbol: string
  quoteId: string
  baseVolume24h: number
  quoteVolume24h: number
  lastPrice: number
  lastPriceUsd: number
  priceChangePercent24h: number
  priceChangePercentWeek: number
  priceChangePercent24hUsd: number
  priceChangePercentWeekUsd: number
  yesterdayPrice: number
}

export interface ITradingPairData extends ITradingPairDataBase {
  highUsd: number
  lowUsd: number
  highBtc: number
  lowBtc: number
}

export interface Summary {
  pairs: { [key: string]: TradingPairDataItem }
  updated_at: Date
  total_volume_btc: number
  total_volume_usd: number
}

export interface AssetData {
  id: string
  symbol: string | undefined
  name: string | undefined
  circulatingSupply: number
  cryptoAssetId: number
}

interface AssetDataItem {
  symbol: string | undefined
  name: string | undefined
  id: string
  unified_cryptoasset_id: number | null
  circulating_supply: number
  updated: Date
}

export interface Asset {
  [key: string]: AssetDataItem
}

export interface TvlData {
  [key: string]: {}
  totalBtc: number
  totalUsd: number
}

interface TvlBaseData {
  total_btc: number
  total_usd: number
  updatedAt: Date
}

export interface ITvl extends TvlBaseData {
  [key: string]: any
}

export interface ILendingPoolApyItem {
  supply: number
  supply_apr: number
  borrow_apr: number
  timestamp: Date
}
