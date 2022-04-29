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
    const k = `${item.baseId}_${item.quoteId}`
    output[k] = {
      base_symbol: item.baseSymbol,
      base_id: item.baseId,
      quote_symbol: item.quoteSymbol,
      quote_id: item.quoteId,
      amm_address: item.poolId,
      base_asset_liquidity: Number(item.baseAssetLiquidity),
      quote_asset_liquidity: Number(item.quoteAssetLiquidity)
    }
  })
  return output
}
