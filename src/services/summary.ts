/**
 * This service handles getting the data from the /summary CMC endpoint
 *
 */

import { priceAndVolumeQuery } from '../queries/priceAndVolume'
import { candlestickQuery } from '../queries/candlesticks'
import { blockNumber } from '../queries/block'
import { getQuery } from '../utils/apolloClient'
import { isNil } from 'lodash'
import { bignumber } from 'mathjs'
import { createMultipleSummaryPairData } from '../models/summary.model'

interface ConnectorToken {
  token: {
    symbol: string
  }
  totalVolume: string
}

interface Token {
  symbol: string
  id: string
  lastPriceBtc: string
  lastPriceUsd: string
}

interface LiquidityPool {
  id: string
  connectorTokens: ConnectorToken[]
  token0: Token
  token1: Token
}

export interface ITradingPairData {
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
  highUsd: number
  lowUsd: number
  highBtc: number
  lowBtc: number
}

export async function main (): Promise<void> {
  console.log('Running main...')
  const data = await getQuery(priceAndVolumeQuery())
  const currentData: LiquidityPool[] = data.liquidityPools
  /** We assume 30 second block time */
  const yesterdayBlock = await getQuery(
    blockNumber(Math.floor((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000))
  ).then((res) => parseInt(res.transactions[0].blockNumber))
  const lastWeekBlock = await getQuery(
    blockNumber(
      Math.floor((new Date().getTime() - 24 * 60 * 60 * 7 * 1000) / 1000)
    )
  ).then((res) => parseInt(res.transactions[0].blockNumber))
  const dayData: { liquidityPools: LiquidityPool[] } = await getQuery(
    priceAndVolumeQuery(yesterdayBlock)
  )
  const weekData: { liquidityPools: LiquidityPool[] } = await getQuery(
    priceAndVolumeQuery(lastWeekBlock)
  )

  const sortedByPairs = currentData.map((item) => {
    const itemDayData = dayData.liquidityPools.find(
      (dayItem) => dayItem.id === item.id
    )
    const itemWeekData = weekData.liquidityPools.find(
      (weekItem) => weekItem.id === item.id
    )
    return {
      currentData: item,
      dayData: !isNil(itemDayData) ? itemDayData : item,
      weekData: !isNil(itemWeekData) ? itemWeekData : item
    }
  })

  const parsedData = sortedByPairs.map((item) => {
    const currentData = item.currentData
    const dayData = item.dayData
    const weekData = item.weekData

    /** TODO: Dry up this code */
    const currentBaseTokenData = currentData.connectorTokens.find(
      (item) => item.token.symbol === currentData.token1.symbol
    )
    const currentBaseVolume = !isNil(currentBaseTokenData)
      ? parseFloat(currentBaseTokenData.totalVolume)
      : 0

    const currentQuoteTokenData = currentData.connectorTokens.find(
      (item) => item.token.symbol === currentData.token0.symbol
    )
    const currentQuoteVolume = !isNil(currentQuoteTokenData)
      ? parseFloat(currentQuoteTokenData.totalVolume)
      : 0

    const dayBaseTokenData = dayData.connectorTokens.find(
      (item) => item.token.symbol === currentData.token1.symbol
    )
    const dayBaseVolume = !isNil(dayBaseTokenData)
      ? parseFloat(dayBaseTokenData.totalVolume)
      : 0

    const dayQuoteTOkenData = dayData.connectorTokens.find(
      (item) => item.token.symbol === currentData.token0.symbol
    )
    const dayQuoteVolume = !isNil(dayQuoteTOkenData)
      ? parseFloat(dayQuoteTOkenData.totalVolume)
      : 0

    return {
      tradingPair: currentData.token1.id + '_' + currentData.token0.id,
      baseSymbol: currentData.token1.symbol,
      baseId: currentData.token1.id,
      quoteSymbol: currentData.token0.symbol,
      quoteId: currentData.token0.id,
      baseVolume24h: currentBaseVolume - dayBaseVolume,
      quoteVolume24h: currentQuoteVolume - dayQuoteVolume,
      lastPrice: parseFloat(currentData.token1.lastPriceBtc),
      lastPriceUsd: parseFloat(currentData.token1.lastPriceUsd),
      priceChangePercent24h: calculatePriceChange(
        currentData.token1.lastPriceBtc,
        dayData.token1.lastPriceBtc
      ),
      priceChangePercentWeek: calculatePriceChange(
        currentData.token1.lastPriceBtc,
        weekData.token1.lastPriceBtc
      ),
      priceChangePercent24hUsd: calculatePriceChange(
        currentData.token1.lastPriceUsd,
        dayData.token1.lastPriceUsd
      ),
      priceChangePercentWeekUsd: calculatePriceChange(
        currentData.token1.lastPriceUsd,
        weekData.token1.lastPriceUsd
      )
    }
  })

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

function calculatePriceChange (currentPrice: string, prevPrice: string): number {
  const delta = bignumber(currentPrice).minus(parseFloat(prevPrice))
  const percentChange = delta.div(parseFloat(currentPrice)).mul(100)
  return parseFloat(percentChange.toFixed(8))
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

// getHighAndLowPrices("0xefc78fc7d48b64958315949279ba181c2114abbd");
// main();
