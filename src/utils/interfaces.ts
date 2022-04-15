interface TradingPairData {
  trading_pairs: string
  base_symbol: string
  base_id: string
  quote_symbol: string
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
}

export interface Summary {
  pairs: { [key: string]: TradingPairData }
  updated_at: Date
  total_volume_btc: number
  total_volume_usd: number
}

export interface AssetData {
  symbol: string | undefined
  name: string | undefined
  id: string
  unified_cryptoasset_id: number | null
  circulating_supply: number
  updated: Date
}

export interface Asset {
  [key: string]: AssetData
}
