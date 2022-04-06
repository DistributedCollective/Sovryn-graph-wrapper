// transactions(where: {timestamp_gte: 1649168392}, orderBy: timestamp, first: 1) {
//     blockNumber
//     timestamp
//   }

import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
// import { getQuery } from "../utils/apolloClient";

export const blockNumber = (timestamp: number): DocumentNode => {
  return gql`
    {
      transactions(
        where: { timestamp_gte: ${timestamp} }
        orderBy: timestamp
        first: 1
      ) {
        blockNumber
        timestamp
      }
    }
  `
}
