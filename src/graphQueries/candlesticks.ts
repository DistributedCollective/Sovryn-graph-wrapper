import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export const candlestickQuery = (
  baseToken: string,
  interval: string,
  startTime: number
): DocumentNode => {
  return gql`
    {
      candleSticks(
        where: {
          baseToken: "${baseToken}"
          interval: ${interval}
          periodStartUnix_gt: ${startTime}
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
