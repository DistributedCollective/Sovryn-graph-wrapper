import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
// import { getQuery } from "../utils/apolloClient";

export const tradesQuery = (
  liquidityPool: string,
  startTime: number
): DocumentNode => {
  return gql`
    {
      conversions(
        where: {
          emittedBy: "${liquidityPool}"
          timestamp_gte: ${startTime}
        }
        orderBy: timestamp
        orderDirection: desc
      ) {
        emittedBy
        _fromToken {
          id
        }
        _toToken {
          id
        }
        id
        _amount
        _return
        timestamp
        transaction {
          id
        }
      }
    }
  `
}
