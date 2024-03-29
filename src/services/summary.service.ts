/**
 * This service handles getting the data from the /summary CMC endpoint
 *
 */

import { priceAndVolumeQuery } from '../graphQueries/priceAndVolume'
import { candlestickQuery } from '../graphQueries/candlesticks'
import { blockNumberFromTimestamp } from '../graphQueries/block'
import { getQuery } from '../utils/apolloClient'
import { isNil } from 'lodash'
import { bignumber } from 'mathjs'
import { createMultipleSummaryPairData } from '../models/summary.model'
import {
  Transaction,
  LiquidityPool,
  CandleStickHour
} from '../generated-schema'
import { ITradingPairDataBase, ITradingPairData } from '../utils/interfaces'
import log from '../logger'

const logger = log.logger.child({ module: 'Summary' })

interface LiquidityPoolData {
  liquidityPools: LiquidityPool[]
}

const DAY_MILLISECONDS = 24 * 60 * 60 * 1000
const WEEK_MILLISECONDS = 24 * 60 * 60 * 7 * 1000

export default async function main (): Promise<void> {
  logger.info('Running Summary Data main function')
  try {
    logger.debug('Getting block numbers')
    const yesterdayBlock = await getBlockNumberFromDate(
      Math.floor((new Date().getTime() - DAY_MILLISECONDS) / 1000)
    )
    const lastWeekBlock = await getBlockNumberFromDate(
      Math.floor((new Date().getTime() - WEEK_MILLISECONDS) / 1000)
    )

    logger.debug('Getting liquidity pool data')
    const currentData: LiquidityPoolData = await getQuery(
      priceAndVolumeQuery()
    )

    const dayData: LiquidityPoolData = await getQuery(
      priceAndVolumeQuery(yesterdayBlock)
    )
    const weekData: LiquidityPoolData = await getQuery(
      priceAndVolumeQuery(lastWeekBlock)
    )
    const sortedData = sortByPairs(
      currentData.liquidityPools,
      dayData.liquidityPools,
      weekData.liquidityPools
    )
    const parsedData = parseData(sortedData)
    const output: ITradingPairData[] = []
    for (const i of parsedData) {
      const highLowPrices = await getHighAndLowPrices(
        i.baseId,
        i.lastPrice,
        i.lastPriceUsd
      )
      const item = {
        ...i,
        ...highLowPrices
      }
      output.push(item)
    }

    logger.debug('Saving data')
    await createMultipleSummaryPairData(output)
    logger.info('Summary Data main function completed')
  } catch (e) {
    logger.error(e as Error, 'Error running summary main data')
  }
}

async function getBlockNumberFromDate (timestamp: number): Promise<number> {
  const data = await getQuery(blockNumberFromTimestamp(timestamp))
  const transactions = data.transactions as Transaction[]
  return Number(transactions[0].blockNumber)
}

const sortByPairs = (
  currentData: LiquidityPool[],
  dayData: LiquidityPool[],
  weekData: LiquidityPool[]
): Array<{
  currentData: LiquidityPool
  dayData: LiquidityPool
  weekData: LiquidityPool
}> =>
  currentData.map((item) => {
    const itemDayData = dayData.find((dayItem) => dayItem.id === item.id)
    const itemWeekData = weekData.find((weekItem) => weekItem.id === item.id)

    return {
      currentData: item,
      dayData: !isNil(itemDayData) ? itemDayData : item,
      weekData: !isNil(itemWeekData) ? itemWeekData : item
    }
  })

const parseData = (
  sorted: Array<{
    currentData: LiquidityPool
    dayData: LiquidityPool
    weekData: LiquidityPool
  }>
): ITradingPairDataBase[] => {
  return sorted.map((item) => {
    const currentData = item.currentData
    const dayData = item.dayData
    const weekData = item.weekData

    let currentBaseVolume = 0
    let currentQuoteVolume = 0
    let dayBaseVolume = 0
    let dayQuoteVolume = 0

    const isBaseTokenConnector0 =
      currentData.connectorTokens[0].token.symbol ===
      currentData?.token1?.symbol

    currentBaseVolume = parseFloat(
      isBaseTokenConnector0
        ? currentData.connectorTokens[0].totalVolume
        : currentData.connectorTokens[1].totalVolume
    )
    currentQuoteVolume = parseFloat(
      isBaseTokenConnector0
        ? currentData.connectorTokens[1].totalVolume
        : currentData.connectorTokens[0].totalVolume
    )
    dayBaseVolume = parseFloat(
      isBaseTokenConnector0
        ? dayData.connectorTokens[0].totalVolume
        : dayData.connectorTokens[1].totalVolume
    )
    dayQuoteVolume = parseFloat(
      isBaseTokenConnector0
        ? dayData.connectorTokens[1].totalVolume
        : dayData.connectorTokens[0].totalVolume
    )

    const lastPriceBtc = currentData?.token1?.lastPriceBtc
    const lastPriceUsd = currentData?.token1?.lastPriceUsd
    const baseTokenSymbol = currentData.token1?.symbol
    const baseTokenId = currentData.token1?.id
    const quoteTokenSymbol = currentData.token0?.symbol
    const quoteTokenId = currentData.token0?.id

    return {
      poolId: currentData.id,
      baseSymbol: !isNil(baseTokenSymbol) ? baseTokenSymbol : '',
      baseId: !isNil(baseTokenId) ? baseTokenId : '',
      quoteSymbol: !isNil(quoteTokenSymbol) ? quoteTokenSymbol : '',
      quoteId: !isNil(quoteTokenId) ? quoteTokenId : '',
      baseVolume24h: currentBaseVolume - dayBaseVolume,
      quoteVolume24h: currentQuoteVolume - dayQuoteVolume,
      lastPrice: !isNil(lastPriceBtc) ? parseFloat(lastPriceBtc) : 0,
      lastPriceUsd: !isNil(lastPriceUsd) ? parseFloat(lastPriceUsd) : 0,
      priceChangePercent24h: calculatePriceChange(
        lastPriceBtc,
        dayData?.token1?.lastPriceBtc
      ),
      priceChangePercentWeek: calculatePriceChange(
        lastPriceBtc,
        weekData?.token1?.lastPriceBtc
      ),
      priceChangePercent24hUsd: calculatePriceChange(
        lastPriceUsd,
        dayData?.token1?.lastPriceUsd
      ),
      priceChangePercentWeekUsd: calculatePriceChange(
        lastPriceUsd,
        weekData?.token1?.lastPriceUsd
      ),
      /** dayPrice is the BTC price 24 hours ago. This is used by frontend  */
      dayPrice: !isNil(dayData?.token1)
        ? parseFloat(dayData?.token1?.lastPriceBtc)
        : 100
    }
  })
}

export function calculatePriceChange (
  currentPrice: string | undefined,
  prevPrice: string | undefined
): number {
  if (isNil(currentPrice) || isNil(prevPrice) || prevPrice === '0') {
    return 0
  }
  const delta = bignumber(currentPrice).minus(parseFloat(prevPrice))
  const percentChange = delta.div(parseFloat(prevPrice)).mul(100)
  return parseFloat(percentChange.toFixed(2))
}

/** Retrieves previous 24 hours of candlesticks to get high/low */
export async function getHighAndLowPrices (
  baseToken: string,
  currentBtcPrice: number,
  currentUsdPrice: number
): Promise<{
    highUsd: number
    lowUsd: number
    highBtc: number
    lowBtc: number
  }> {
  const yesterdayTimestamp = Math.floor(
    (new Date().getTime() - DAY_MILLISECONDS) / 1000
  )
  const query = candlestickQuery(baseToken, yesterdayTimestamp)
  const queryData = await getQuery(query)
  let highUsd: number = currentUsdPrice
  let lowUsd: number = currentUsdPrice
  let highBtc: number = currentBtcPrice
  let lowBtc: number = currentBtcPrice
  if (!isNil(queryData) && !isNil(queryData.candleStickHours)) {
    const candlesticks = queryData.candleStickHours as CandleStickHour[]
    for (const i of candlesticks) {
      if (i.quoteToken?.symbol === 'XUSD') {
        if (lowUsd === 0) lowUsd = parseFloat(i.low)
        if (parseFloat(i.high) > highUsd) {
          highUsd = parseFloat(i.high)
        }
        if (parseFloat(i.low) < lowUsd) {
          lowUsd = parseFloat(i.low)
        }
      } else if (i.quoteToken?.symbol === 'WRBTC') {
        if (lowBtc === 0) lowBtc = parseFloat(i.low)
        if (parseFloat(i.high) > highBtc) {
          highBtc = parseFloat(i.high)
        }
        if (parseFloat(i.low) < lowBtc) {
          lowBtc = parseFloat(i.low)
        }
      }
    }
  }
  return {
    highUsd: highUsd,
    lowUsd: lowUsd,
    highBtc: highBtc,
    lowBtc: lowBtc
  }
}
