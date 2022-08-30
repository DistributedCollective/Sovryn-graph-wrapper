import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export const candlestickQuery = (
  baseToken: string,
  startTime: number
): DocumentNode => {
  return gql`
    {
      candleStickHours(
        where: {
          baseToken: "${baseToken}"
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
