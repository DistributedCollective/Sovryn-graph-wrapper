import { getAllAssetData } from '../models/asset.model'
import { Asset, AssetData } from '../utils/interfaces'
import { HTTP500Error } from '../errorHandlers/baseError'
import log from '../logger'

const logger = log.logger.child({ module: 'Asset Controller' })

export const getAssetData = async (): Promise<Asset> => {
  try {
    const data = await getAllAssetData()
    const output: { [key: string]: AssetData } = {}
    data.forEach((item) => {
      output[item.id] = {
        symbol: item.symbol,
        name: item.name,
        id: item.id,
        unified_cryptoasset_id:
          item.cryptoAssetId > 0 ? item.cryptoAssetId : null,
        circulating_supply: Number(item.circulatingSupply),
        updated: item.updatedAt
      }
    })
    return output
  } catch (e) {
    const error = e as Error
    logger.error(error, error.message)
    throw new HTTP500Error('Unable to return asset data')
  }
}
