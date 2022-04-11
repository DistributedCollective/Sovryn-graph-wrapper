import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
// import { getQuery } from "../utils/apolloClient";

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

// getQuery(
//   candlestickQuery(
//     "0xefc78fc7d48b64958315949279ba181c2114abbd",
//     "HourInterval",
//     1649168392
//   )
// ).then((res) => console.log(res));
