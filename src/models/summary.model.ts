import { getRepository } from 'typeorm'
import { LiquidityPoolSummary } from '../entity'
import { ITradingPairData } from '../utils/interfaces'
import { notEmpty } from '../utils/common'
import { inversePrice } from '../utils/helpers'
import { isNil } from 'lodash'
import { HTTP400Error, HTTP404Error } from '../errorHandlers/baseError'
import log from '../logger'

const logger = log.logger.child({ module: 'Summary Model' })

export const createMultipleSummaryPairData = async (
  summaryPairData: ITradingPairData[]
): Promise<LiquidityPoolSummary[]> => {
  const repository = getRepository(LiquidityPoolSummary)
  const promises = summaryPairData
    .filter((data) => data.lastPriceUsd > 0)
    .map(async (data) => {
      // console.debug(data);
      try {
        const newSummaryPairData: LiquidityPoolSummary =
          new LiquidityPoolSummary()
        newSummaryPairData.poolId = data.poolId
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

        await newSummaryPairData.validate()
        return data
      } catch (error) {
        return null
      }
    })
  const validatedSummaryData = await Promise.all(promises)
  const filteredSummaryData = validatedSummaryData.filter(notEmpty)

  const result: LiquidityPoolSummary[] = await repository.save(
    filteredSummaryData
  )
  return result
}

export const getAllSummaryPairData = async (): Promise<
LiquidityPoolSummary[]
> => {
  const repository = getRepository(LiquidityPoolSummary)
  const data = await repository.find()
  return data
}

export const getBtcUsdPrice = async (): Promise<number> => {
  const repository = getRepository(LiquidityPoolSummary)
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
  const repository = getRepository(LiquidityPoolSummary)
  const data = await repository
    .createQueryBuilder()
    .select(['baseId', 'lastPriceBtc', 'lastPriceUsd'])
    .getRawMany()
  return data
}

interface UpdateLiquidity {
  contract: string
  balances: {
    [key: string]: number
  }
}

export const updateLiquidityColumn = async (
  data: UpdateLiquidity
): Promise<void> => {
  const repository = getRepository(LiquidityPoolSummary)
  const row = await repository.findOne(data.contract)
  if (!isNil(row)) {
    const baseAssetLiquidity = !isNil(data.balances[row.baseId])
      ? data.balances[row.baseId]
      : 0
    const quoteAssetLiquidity = !isNil(data.balances[row.quoteId])
      ? data.balances[row.quoteId]
      : 0
    await repository.update(row.poolId, {
      baseAssetLiquidity: baseAssetLiquidity,
      quoteAssetLiquidity: quoteAssetLiquidity
    })
  }
}

export const getAmmLiquidityData = async (): Promise<
LiquidityPoolSummary[]
> => {
  const repository = getRepository(LiquidityPoolSummary)
  const data = await repository.find({
    select: [
      'poolId',
      'baseId',
      'baseSymbol',
      'quoteId',
      'quoteSymbol',
      'baseAssetLiquidity',
      'quoteAssetLiquidity'
    ]
  })
  return data
}

export const getSummaryTickerData = async (): Promise<
LiquidityPoolSummary[]
> => {
  const repository = getRepository(LiquidityPoolSummary)
  const data = await repository.find({
    select: [
      'baseId',
      'baseSymbol',
      'quoteId',
      'quoteSymbol',
      'baseAssetLiquidity',
      'quoteAssetLiquidity',
      'lastPrice',
      'baseVolume24h',
      'quoteVolume24h',
      'updatedAt'
    ]
  })
  return data
}

export const getPoolDataBySymbol = async (
  symbol: string
): Promise<LiquidityPoolSummary> => {
  try {
    const repository = getRepository(LiquidityPoolSummary)
    const data = await repository.findOne({
      select: [
        'poolId',
        'baseSymbol',
        'quoteSymbol',
        'baseAssetLiquidity',
        'quoteAssetLiquidity',
        'baseVolume24h',
        'quoteVolume24h'
      ],
      where: {
        baseSymbol: symbol
      }
    })
    if (isNil(data)) {
      throw new HTTP404Error(`Pool data not found for ${symbol}`)
    } else {
      return data
    }
  } catch (e) {
    const error = e as Error
    logger.error(error.message, [error])
    throw new HTTP400Error(`Error getting pool data for: ${symbol}`)
  }
}

export const getPoolDataByAddress = async (
  address: string
): Promise<LiquidityPoolSummary> => {
  try {
    const repository = getRepository(LiquidityPoolSummary)
    const data = await repository.findOne({
      select: [
        'poolId',
        'baseSymbol',
        'quoteSymbol',
        'baseAssetLiquidity',
        'quoteAssetLiquidity',
        'baseVolume24h',
        'quoteVolume24h'
      ],
      where: {
        poolId: address
      }
    })
    if (isNil(data)) {
      throw new HTTP404Error(`Pool data not found for ${address}`)
    } else {
      return data
    }
  } catch (e) {
    const error = e as Error
    logger.error(error.message, [error])
    throw error
  }
}

export const getSovBtcPairData = async (): Promise<LiquidityPoolSummary> => {
  try {
    const repository = getRepository(LiquidityPoolSummary)
    const data = await repository.findOneOrFail({
      select: ['lastPrice', 'lastPriceUsd', 'updatedAt'],
      where: {
        baseSymbol: 'SOV',
        quoteSymbol: 'WRBTC'
      }
    })
    return data
  } catch (e) {
    const error = e as Error
    logger.error(error.message, [error])
    throw new Error('Error getting SOV/RBTC pair data')
  }
}
