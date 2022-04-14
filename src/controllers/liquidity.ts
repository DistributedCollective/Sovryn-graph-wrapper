import { getAmmLiquidityData } from '../models/summary.model'

interface LiquidityItem {
  base_symbol: string
  base_id: string
  quote_symbol: string
  quote_id: string
  amm_address: string
  base_asset_liquidity: number
  quote_asset_liquidity: number
}

export async function getLiquidityData (): Promise<{
  [key: string]: LiquidityItem
}> {
  const output: { [key: string]: LiquidityItem } = {}
  const result = await getAmmLiquidityData()
  result.forEach((item) => {
    const k = `${item.summary_baseId}_${item.summary_quoteId}`
    output[k] = {
      base_symbol: item.summary_baseSymbol,
      base_id: item.summary_baseId,
      quote_symbol: item.summary_quoteSymbol,
      quote_id: item.summary_quoteId,
      amm_address: item.summary_poolId,
      base_asset_liquidity: Number(item.summary_baseAssetLiquidity),
      quote_asset_liquidity: Number(item.summary_quoteAssetLiquidity)
    }
  })
  return output
}
