import { LiquidityPoolSummary } from '../entity'
import {
  getPoolDataByAddress,
  getPoolDataBySymbol
} from '../models/summary.model'

export async function getPoolData (
  id: string,
  idType: 'symbol' | 'address'
): Promise<LiquidityPoolSummary> {
  if (idType === 'symbol') {
    const data = await getPoolDataBySymbol(id)
    return data
  } else {
    const data = await getPoolDataByAddress(id)
    return data
  }
}
