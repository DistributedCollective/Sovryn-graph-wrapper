import { getRepository } from 'typeorm'
import { SummaryPairData } from '../entity'
import { ITradingPairData } from '../services/summary'
import { notEmpty } from '../utils/common'
import { inversePrice } from '../utils/helpers'

export const createMultipleSummaryPairData = async (
  summaryPairData: ITradingPairData[]
): Promise<SummaryPairData[]> => {
  const repository = getRepository(SummaryPairData)
  const promises = summaryPairData.map(async (data) => {
    // console.debug(data);
    try {
      const newSummaryPairData: SummaryPairData = new SummaryPairData()
      newSummaryPairData.poolId = data.poolId
      newSummaryPairData.tradingPair = data.tradingPair
      newSummaryPairData.baseSymbol = data.baseSymbol
      newSummaryPairData.baseId = data.baseId
      newSummaryPairData.quoteSymbol = data.quoteSymbol
      newSummaryPairData.quoteId = data.quoteId
      newSummaryPairData.baseVolume24h = parseFloat(
        data.baseVolume24h.toFixed(18)
      )
      newSummaryPairData.quoteVolume24h = parseFloat(
        data.quoteVolume24h.toFixed(18)
      )
      newSummaryPairData.lastPrice = parseFloat(data.lastPrice.toFixed(18))
      newSummaryPairData.lastPriceUsd = parseFloat(
        data.lastPriceUsd.toFixed(2)
      )
      newSummaryPairData.priceChangePercent24h = parseFloat(
        data.priceChangePercent24h.toFixed(2)
      )
      newSummaryPairData.priceChangePercentWeek = parseFloat(
        data.priceChangePercentWeek.toFixed(2)
      )
      newSummaryPairData.priceChangePercent24hUsd = parseFloat(
        data.priceChangePercent24hUsd.toFixed(2)
      )
      newSummaryPairData.priceChangePercentWeekUsd = parseFloat(
        data.priceChangePercentWeekUsd.toFixed(2)
      )
      newSummaryPairData.highUsd = parseFloat(data.highUsd.toFixed(2))
      newSummaryPairData.lowUsd = parseFloat(data.lowUsd.toFixed(2))
      newSummaryPairData.highBtc = parseFloat(data.highBtc.toFixed(18))
      newSummaryPairData.lowBtc = parseFloat(data.lowBtc.toFixed(18))

      await newSummaryPairData.validateStrict()
      return data
    } catch (error) {
      return null
    }
  })
  const validatedSummaryData = await Promise.all(promises)
  const filteredSummaryData = validatedSummaryData.filter(notEmpty)

  const result: SummaryPairData[] = await repository.save(filteredSummaryData)
  return result
}

export const getAllSummaryPairData = async (): Promise<SummaryPairData[]> => {
  const repository = getRepository(SummaryPairData)
  const data = await repository.find()
  return data
}

export const getBtcUsdPrice = async (): Promise<number> => {
  const repository = getRepository(SummaryPairData)
  const data = await repository.findOneOrFail({
    baseSymbol: 'XUSD',
    quoteSymbol: 'WRBTC'
  })

  return inversePrice(data.lastPrice, 2)
}

interface Prices {
  asset: string
  usdPrice: number
  btcPrice: number
}

export const getAssetPrices = async (): Promise<Prices[]> => {
  const repository = getRepository(SummaryPairData)
  const data = await repository
    .createQueryBuilder()
    .select(['baseId', 'lastPriceBtc', 'lastPriceUsd'])
    .getRawMany()
  return data
}
