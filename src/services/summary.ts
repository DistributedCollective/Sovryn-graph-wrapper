/**
 * This service handles getting the data from the /summary CMC endpoint
 *
 */

import { priceAndVolumeQuery } from '../graphQueries/priceAndVolume'
import { candlestickQuery } from '../graphQueries/candlesticks'
import { blockNumber } from '../graphQueries/block'
import { getQuery } from '../utils/apolloClient'
import { isNil } from 'lodash'
import { bignumber } from 'mathjs'
import { createMultipleSummaryPairData } from '../models/summary.model'
import { CronJob } from 'cron'
import { Transaction, LiquidityPool } from '../generated/graphql'

interface LiquidityPoolData {
  liquidityPools: LiquidityPool[]
}

interface ITradingPairDataBase {
  tradingPair: string
  baseSymbol: string
  baseId: string
  quoteSymbol: string
  quoteId: string
  baseVolume24h: number
  quoteVolume24h: number
  lastPrice: number
  lastPriceUsd: number
  priceChangePercent24h: number
  priceChangePercentWeek: number
  priceChangePercent24hUsd: number
  priceChangePercentWeekUsd: number
}

export interface ITradingPairData extends ITradingPairDataBase {
  highUsd: number
  lowUsd: number
  highBtc: number
  lowBtc: number
}

async function getBlockNumberFromDate (timestamp: number): Promise<number> {
  const { data } = await getQuery(blockNumber(timestamp))
  const transactions = data as Transaction[]
  return parseInt(transactions[0].blockNumber)
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
): any => {
  return sorted.map((item) => {
    const currentData = item.currentData
    const dayData = item.dayData
    const weekData = item.weekData

    /** TODO: Dry up this code */
    let currentBaseVolume = 0
    let currentQuoteVolume = 0
    let dayBaseVolume = 0
    let dayQuoteVolume = 0

    if (
      currentData.connectorTokens[0].token.symbol ===
      currentData?.token1?.symbol
    ) {
      currentBaseVolume = parseFloat(
        currentData.connectorTokens[0].totalVolume
      )
      currentQuoteVolume = parseFloat(
        currentData.connectorTokens[1].totalVolume
      )
      dayBaseVolume = parseFloat(dayData.connectorTokens[0].totalVolume)
      dayQuoteVolume = parseFloat(dayData.connectorTokens[1].totalVolume)
    } else if (
      currentData.connectorTokens[0].token.symbol ===
      currentData?.token0?.symbol
    ) {
      currentBaseVolume = parseFloat(
        currentData.connectorTokens[1].totalVolume
      )
      currentQuoteVolume = parseFloat(
        currentData.connectorTokens[0].totalVolume
      )
      dayBaseVolume = parseFloat(dayData.connectorTokens[1].totalVolume)
      dayQuoteVolume = parseFloat(dayData.connectorTokens[0].totalVolume)
    }

    const lastPriceBtc = currentData?.token1?.lastPriceBtc
    const lastPriceUsd = currentData?.token1?.lastPriceUsd

    return {
      tradingPair: `${currentData?.token1?.id ?? ''}_${
        currentData?.token0?.id ?? ''
      }`,
      baseSymbol: currentData?.token1?.symbol,
      baseId: currentData?.token1?.id,
      quoteSymbol: currentData?.token0?.symbol,
      quoteId: currentData?.token0?.id,
      baseVolume24h: currentBaseVolume - dayBaseVolume,
      quoteVolume24h: currentQuoteVolume - dayQuoteVolume,
      lastPrice: !isNil(lastPriceBtc) ? parseFloat(lastPriceBtc) : undefined,
      lastPriceUsd: !isNil(lastPriceUsd) ? parseFloat(lastPriceUsd) : undefined,
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
      )
    }
  })
}

async function main (): Promise<void> {
  console.log('Running main...')
  const currentData: LiquidityPoolData = await getQuery(priceAndVolumeQuery())

  const yesterdayBlock = await getBlockNumberFromDate(
    Math.floor((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000)
  )
  const lastWeekBlock = await getBlockNumberFromDate(
    Math.floor((new Date().getTime() - 24 * 60 * 60 * 7 * 1000) / 1000)
  )

  const dayData: LiquidityPoolData = await getQuery(
    priceAndVolumeQuery(yesterdayBlock)
  )
  const weekData: LiquidityPoolData = await getQuery(
    priceAndVolumeQuery(lastWeekBlock)
  )

  const sorted = sortByPairs(
    currentData.liquidityPools,
    dayData.liquidityPools,
    weekData.liquidityPools
  )

  const parsedData = parseData(sorted)
  const output: ITradingPairData[] = []
  for (const i of parsedData) {
    const highLowPrices = await getHighAndLowPrices(i.baseId)
    const item = {
      ...i,
      ...highLowPrices
    }
    output.push(item)
  }
  await createMultipleSummaryPairData(output)
}

function calculatePriceChange (
  currentPrice: string | undefined,
  prevPrice: string | undefined
): number {
  if (isNil(currentPrice) || isNil(prevPrice)) {
    return 0
  }
  const delta = bignumber(currentPrice).minus(parseFloat(prevPrice))
  const percentChange = delta.div(parseFloat(currentPrice)).mul(100)
  return parseFloat(percentChange.toFixed(2))
}

async function getHighAndLowPrices (baseToken: string): Promise<{
  highUsd: number
  lowUsd: number
  highBtc: number
  lowBtc: number
}> {
  const yesterdayTimestamp = Math.floor(
    (new Date().getTime() - 24 * 60 * 60 * 1000) / 1000
  )
  const query = candlestickQuery(baseToken, 'HourInterval', yesterdayTimestamp)
  const candlestickResult = await getQuery(query)
  const candlesticks = candlestickResult.candleSticks
  let highUsd: number = 0
  let lowUsd: number = 0
  let highBtc: number = 0
  let lowBtc: number = 0
  for (const i of candlesticks) {
    if (i.quoteToken.symbol === 'XUSD') {
      if (lowUsd === 0) lowUsd = parseFloat(i.low)
      if (parseFloat(i.high) > highUsd) {
        highUsd = parseFloat(i.high)
      }
      if (parseFloat(i.low) < lowUsd) {
        lowUsd = parseFloat(i.low)
      }
    } else if (i.quoteToken.symbol === 'WRBTC') {
      if (lowBtc === 0) lowBtc = parseFloat(i.low)
      if (parseFloat(i.high) > highBtc) {
        highBtc = parseFloat(i.high)
      }
      if (parseFloat(i.low) < lowBtc) {
        lowBtc = parseFloat(i.low)
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

export class SummaryDataScheduledTask {
  cronJob: CronJob

  constructor (cronTime: string) {
    this.cronJob = new CronJob(
      cronTime,
      () => {
        try {
          main().catch((e) => {
            const error = e as Error
            console.error(error, 'Error running cronjob')
          })
        } catch (e) {
          const error = e as Error
          console.error(error, 'Error running cronjob')
        }
      },
      null,
      true
    )
  }
}

export const summaryDataScheduledTask = new SummaryDataScheduledTask(
  '*/30 * * * * *'
)

// getHighAndLowPrices("0xefc78fc7d48b64958315949279ba181c2114abbd");
// main();
