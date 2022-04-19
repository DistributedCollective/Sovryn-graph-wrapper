import { getAllIlliquidSovData } from '../models/illiquidSov.model'
import { getSovData } from '../models/asset.model'
import { getSovBtcPairData } from '../models/summary.model'

export async function getSovCirculatingSupply (): Promise<{
  circulating_supply: number
  insertion_time: Date
  updated_at: Date
}> {
  const data = await getSovData()
  const output = {
    circulating_supply: Number(data.circulatingSupply),
    /** insertion_time is the same as updated_at, it is just preserved for backwards compatibility */
    insertion_time: data.updatedAt,
    updated_at: data.updatedAt
  }
  return output
}

export async function getSovCurrentPrice (): Promise<{
  price: number
  priceUsd: number
  updatedAt: Date
}> {
  const data = await getSovBtcPairData()
  const output = {
    price: Number(data.lastPrice),
    priceUsd: Number(data.lastPriceUsd),
    updatedAt: data.updatedAt
  }
  return output
}

interface ICircSupplyBreakdown {
  totalSupply: number
  circulatingSupply: number
  circulatingSupplyUpdatedAt: Date
  nonLiquidSov: Array<{
    contractAddress: string
    contractName: string
    balance: number
    updatedAt: Date
  }>
}

export async function getSovCirculatingSupplyBreakdown (): Promise<ICircSupplyBreakdown> {
  const data = await getAllIlliquidSovData()
  const circSupplyData = await getSovData()
  const parsedData = data.map((item) => {
    return {
      contractAddress: item.contract,
      contractName: item.name,
      balance: Number(item.sovBalance),
      updatedAt: item.updatedAt
    }
  })
  const output = {
    totalSupply: Number(100 * 1e6),
    nonLiquidSov: parsedData,
    circulatingSupply: Number(circSupplyData.circulatingSupply),
    circulatingSupplyUpdatedAt: circSupplyData.updatedAt
  }
  return output
}
