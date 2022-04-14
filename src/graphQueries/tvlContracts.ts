import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
// import { getQuery } from "../utils/apolloClient";

export const liquidityPoolContracts: DocumentNode = gql`
  {
    liquidityPools(where: { activated: true }) {
      id
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
    }
  }
`

export const protocolTokens: DocumentNode = gql`
  {
    protocolStats(id: "0") {
      tokens {
        id
        symbol
        lastPriceUsd
        lastPriceBtc
      }
    }
  }
`

export const lendingPoolContracts: DocumentNode = gql`
  {
    lendingPools {
      id
      underlyingAsset {
        id
        symbol
      }
    }
  }
`
