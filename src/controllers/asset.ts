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
      trading_fee: item.tradingFee,
      unified_cryptoasset_id: item.unifiedCryptoAssetId,
      circulating_supply: parseInt(item.circulatingSupply),
      updated: item.updatedAt
    }
  })
  return output
}
