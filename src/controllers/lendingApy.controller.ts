import { getLendingPoolApy } from '../models/lendingApy.model'
import { ILendingPoolApyItem } from '../utils/interfaces'

export async function getPoolApy (pool: string): Promise<ILendingPoolApyItem[]> {
  const data = await getLendingPoolApy(pool)
  const parsedData = data.map((item) => {
    return {
      supply: item.supply,
      supply_apr: item.supplyApr,
      borrow_apr: item.borrowApr,
      timestamp: item.timestamp
    }
  })
  return parsedData
}
