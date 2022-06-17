import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export const blockNumberFromTimestamp = (timestamp: number): DocumentNode => {
  return gql`
    {
      transactions(
        where: { timestamp_lte: ${timestamp} }
        orderBy: timestamp
        orderDirection: desc
        first: 1
      ) {
        blockNumber
        timestamp
      }
    }
  `
}
