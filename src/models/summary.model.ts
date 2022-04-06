import { getRepository } from 'typeorm'
import { SummaryPairData } from '../entity'
import { ITradingPairData } from '../services/summary'
import { notEmpty } from '../utils/common'

export const createMultipleSummaryPairData = async (
  summaryPairData: ITradingPairData[]
): Promise<SummaryPairData[]> => {
  const repository = getRepository(SummaryPairData)
  const promises = summaryPairData.map(async (data) => {
    try {
      const newSummaryPairData: SummaryPairData = new SummaryPairData()
      newSummaryPairData.tradingPair = data.tradingPair
      newSummaryPairData.baseSymbol = data.baseSymbol
      newSummaryPairData.baseId = data.baseId
      newSummaryPairData.quoteSymbol = data.quoteSymbol
      newSummaryPairData.quoteId = data.quoteId
      newSummaryPairData.baseVolume24h = data.baseVolume24h
      newSummaryPairData.quoteVolume24h = data.quoteVolume24h
      newSummaryPairData.lastPrice = data.lastPrice
      newSummaryPairData.lastPriceUsd = data.lastPriceUsd
      newSummaryPairData.priceChangePercent24h = data.priceChangePercent24h
      newSummaryPairData.priceChangePercentWeek = data.priceChangePercentWeek
      newSummaryPairData.priceChangePercent24hUsd =
        data.priceChangePercent24hUsd
      newSummaryPairData.priceChangePercentWeekUsd =
        data.priceChangePercentWeekUsd
      newSummaryPairData.highUsd = data.highUsd
      newSummaryPairData.lowUsd = data.lowUsd
      newSummaryPairData.highBtc = data.highBtc
      newSummaryPairData.lowBtc = data.lowBtc

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
