/**
 * 1. Get all tvl data
 * 2. Parse all tvl data
 * 3. Add totals to tvl data
 */

import { getAllTvlData } from '../models/tvl.model'
import { TvlGroup } from '../services/tvl.service'
import { isNil } from 'lodash'
import { ITvl } from '../utils/interfaces'

export async function getTvlData (): Promise<ITvl> {
  const data = await getAllTvlData()
  const output: ITvl = {
    total_btc: 0,
    total_usd: 0,
    updatedAt: new Date()
  }
  Object.values(TvlGroup).forEach((item) => {
    output[item] = {
      totalBtc: 0,
      totalUsd: 0
    }
  })
  data.forEach((item) => {
    if (!isNil(output[item.tvlGroup])) {
      const entry = {
        assetName: item.name.split('_')[0],
        contract: item.contract,
        asset: item.asset,
        balance: Number(item.balance),
        balanceBtc: Number(item.balanceBtc),
        balanceUsd: Number(item.balanceUsd)
      }
      output[item.tvlGroup][item.name] = entry

      if (!isNaN(output[item.tvlGroup].totalBtc)) {
        output[item.tvlGroup].totalBtc =
          Number(output[item.tvlGroup].total_btc) + Number(item.balanceBtc)
      }
      if (!isNaN(output.total_btc)) output.total_btc += Number(item.balanceBtc)
      if (!isNaN(output[item.tvlGroup].totalUsd)) {
        output[item.tvlGroup].totalUsd =
          Number(output[item.tvlGroup].totalUsd) + Number(item.balanceUsd)
      }
      if (!isNaN(output.total_usd)) output.total_usd += Number(item.balanceUsd)
    }
  })
  output.updatedAt = data[0].updatedAt
  return output
}
