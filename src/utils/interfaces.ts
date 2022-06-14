interface TradingPairDataItem {
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

export interface IPoolData_Legacy {
  ammPool: string
  contractBalanceToken: number
  contractBalanceBtc: number
  volumeToken: number
  volumeBtc: number
  yesterdayApy: Array<{
    pool: string
    pool_token: string
    activity_date: Date
    apy: number
  }>
}

export interface IPoolData {
  ammPool: string
  data: {
    [key: string]: {
      contractBalance: number
      volume24h: number
      apy: number
    }
  }
}
