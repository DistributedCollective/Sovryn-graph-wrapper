/**
 * This service handles getting the data from the /summary CMC endpoint
 *
 */

import { priceAndVolumeQuery } from '../queries/priceAndVolume'
import { getQuery } from '../utils/apolloClient'
import { isNil } from 'lodash'
import { bignumber } from 'mathjs'

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

interface ITradingPairData {
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

export async function main (): Promise<void> {
  console.log('Running main...')
  const data = await getQuery(priceAndVolumeQuery())
  const currentBlock = data._meta.block.number
  const currentData: LiquidityPool[] = data.liquidityPools
  /** We assume 30 second block time */
  const yesterdayBlock = currentBlock - 2880
  const lastWeekBlock = currentBlock - 2880 * 7
  const dayData: { liquidityPools: LiquidityPool[] } = await getQuery(
    priceAndVolumeQuery(yesterdayBlock)
  )
  console.log(dayData)
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

  const parsedData: ITradingPairData[] = sortedByPairs.map((item) => {
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

  console.log(parsedData)
}

function calculatePriceChange (currentPrice: string, prevPrice: string): number {
  const delta = bignumber(currentPrice).minus(parseFloat(prevPrice))
  const percentChange = delta.div(parseFloat(currentPrice)).mul(100)
  return parseFloat(percentChange.toFixed(8))
}

// main()
