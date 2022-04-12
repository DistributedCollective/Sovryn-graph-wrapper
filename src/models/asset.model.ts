import { getRepository } from 'typeorm'
import { AssetData } from '../services/assets'
import { Asset } from '../entity'
import { notEmpty } from '../utils/common'

export const createMultipleAssets = async (
  assetData: AssetData[]
): Promise<Asset[]> => {
  const repository = getRepository(Asset)
  const promises = assetData.map(async (data) => {
    try {
      const newAssetData = new Asset()
      newAssetData.id = data.id
      newAssetData.symbol = data.name
      newAssetData.name = data.symbol
      newAssetData.circulatingSupply = data.circulatingSupply
      newAssetData.unifiedCryptoAssetId = 0
      newAssetData.tradingFee = 0.0015
      await newAssetData.validateStrict()
      return data
    } catch (error) {
      return null
    }
  })
  const validatedSummaryData = await Promise.all(promises)
  const filteredSummaryData = validatedSummaryData.filter(notEmpty)

  const result = repository.save(filteredSummaryData)
  return await result
}

export const getAllAssetData = async (): Promise<Asset[]> => {
  const repository = getRepository(Asset)
  const data = await repository.find()
  return data
}
