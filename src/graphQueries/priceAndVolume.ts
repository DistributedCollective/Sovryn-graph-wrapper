import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const priceAndVolumeQuery = (block: number = 0): DocumentNode => {
  if (block > 0) {
    return gql`
      {
        liquidityPools(where: { activated: true }, block: {number: ${block}}) {
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
    `;
  } else {
    return gql`
      {
        _meta {
          block {
            number
          }
        }
        liquidityPools(where: { activated: true }) {
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
    `;
  }
};

export const assetDataQuery: DocumentNode = gql`
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
`;
