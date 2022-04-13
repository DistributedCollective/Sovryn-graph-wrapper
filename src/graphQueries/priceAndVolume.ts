import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export const priceAndVolumeQuery = (block: number = 0): DocumentNode => {
  const timeTravelClause = block > 0 ? `, block: {number: ${block}}` : ''

  return gql`
      {
        liquidityPools(where: { activated: true } ${timeTravelClause}) {
          id
          token1 {
            id
            symbol
            lastPriceBtc
            lastPriceUsd
          }
          token0 {
            id
            symbol
            lastPriceBtc
            lastPriceUsd
          }
          connectorTokens {
            token {
              symbol
            }
            totalVolume
          }
        }
      }
    `
}

export const liquidityPoolsByAsset: DocumentNode = gql`
  {
    liquidityPools(where: { activated: true }) {
      id
      type
      token1 {
        id
        name
        symbol
        lastPriceBtc
        lastPriceUsd
      }
    }
  }
`

export const assetDataQuery: DocumentNode = gql`
  {
    protocolStats(id: "0") {
      tokens {
        id
        name
        symbol
        lastPriceBtc
        lastPriceUsd
      }
    }
  }
`
