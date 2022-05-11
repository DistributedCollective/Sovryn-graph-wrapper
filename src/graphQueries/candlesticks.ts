import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { CandleSticksInterval } from '../generated-schema'

export const candlestickQuery = (
  baseToken: string,
  interval: CandleSticksInterval,
  startTime: number
): DocumentNode => {
  return gql`
    {
      candleSticks(
        where: {
          baseToken: "${baseToken}"
          interval: ${interval}
          periodStartUnix_gte: ${startTime}
        },
        orderBy: periodStartUnix
        orderDirection: desc
      ) {
        quoteToken {
          symbol
        }
        high
        low
      }
    }
  `
}
