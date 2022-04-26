import { getAllAssetData } from '../models/asset.model'
import { Asset } from '../utils/interfaces'
import { HTTP500Error } from '../errorHandlers/baseError'
import { Logger } from 'pino'

export const getAssetData = async (log: Logger): Promise<Asset> => {
  try {
    const data = await getAllAssetData()
    const output: Asset = {}
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
    log.error(error, error.message)
    throw new HTTP500Error('Unable to return asset data')
  }
}
