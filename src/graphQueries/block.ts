import { DocumentNode } from "graphql";
import gql from "graphql-tag";
// import { getQuery } from "../utils/apolloClient";

export const blockNumber = (timestamp: number): DocumentNode => {
  return gql`
    {
      query transactions(
        where: { timestamp_gte: ${timestamp} }
        orderBy: timestamp
        first: 1
      ) {
        blockNumber
        timestamp
      }
    }
  `;
};
