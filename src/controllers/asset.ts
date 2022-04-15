import { getAllAssetData } from '../models/asset.model'
import { Asset, AssetData } from '../utils/interfaces'

export const getAssetData = async (): Promise<Asset> => {
  const data = await getAllAssetData()
  const output: { [key: string]: AssetData } = {}
  data.forEach((item) => {
    output[item.id] = {
      symbol: item.symbol,
      name: item.name,
      id: item.id,
      unified_cryptoasset_id:
        item.cryptoAssetId > 0 ? item.cryptoAssetId : null,
      circulating_supply: parseInt(item.circulatingSupply),
      updated: item.updatedAt
    }
  })
  return output
}
