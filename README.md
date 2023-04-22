# Sovryn Graph Wrapper service

1. [Purpose](#purpose)
2. [Overview](#overview)
3. [Data methodology](#data-methodology)
4. [API Endpoints](#api-endpoints)
5. [Dependencies](#dependencies)
6. [Testing and Monitoring](#testing-and-monitoring)
7. [Database Migrations](#database-migrations)

## Purpose

The purpose of this service is to allow Sovryn frontends and third parties to easily access top-level Sovryn data. This includes data on trading pairs, trading volume, lending apy, and token circulating supply and price.

The application wrappers data from the graph and polled contract calls to support api endpoints for coinmarketcap and stats for the Sovryn dapp.

This for parsing and caching data like time-travel graph queries, and also so that we can poll contract balances for cases where this is more efficient than storing this data on the graph.

In future, some of the contract calls here may be moved to the graph.

## Overview

This service contains:

1. An express server with routes that can be found in the /src/routes directory
2. Cron jobs to fetch and store data from the graph and from contracts. These are created from an AbstractCronJob and exported as an array from /src/services/cronJobs.ts

## Data Methodology

All core features in this service use data that is polled and stored by the cronjobs exported in `src/services/cronJobs.ts`.

Polled data:

### assets.service.ts

This cron job gets and saves all data required for the `/cmc/asset` endpoint. This includes circulating supply data for all tokens.

It contains the logic for calculating circulating supply for all tokens where circulating supply is not simply the total supply of the token on RSK.

### lendingApy.service.ts

This cron job gets and save all data required for the `/cmc/lendApy/:lendingPool` endpoint.

It polls the borrow apr and supply apr from the contract for each lending pool and saves this to the database.

### summary.service.ts

This cron job processes and saves all data required for the `/cmc/summary` endpoint. It uses data from time-travel subgraph queries to calculate 24h and one week price changes for each token, and also 24h highs and lows. It also calculates and saves traded volume for each token.

### tvl.service.ts

This cron job gets and stores the data for the `cmc/tvl` endpoint. It gets the balance of each ERC20 token stored on the contracts that make up Sovryn TVL.

As Sovryn TVL is divided into multiple sections (amm, lending etc), the logic for each TVL section is in the `/src/services/tvlSections/` directory.

## API Endpoints

| HTTP Verbs | Endpoints                         | Action                                                                                     |
| ---------- | --------------------------------- | ------------------------------------------------------------------------------------------ |
| GET        | /cmc/summary                      | To retrieve data on all trading pairs and asset prices                                     |
| GET        | /cmc/asset                        | To retrieve data on all individual AMM-traded assets                                       |
| GET        | /cmc/liquidity                    | To retrieve balances of each AMM pool                                                      |
| GET        | /cmc/ticker                       | To retrieve price and volume data for all trading pairs                                    |
| GET        | /cmc/ammPool/symbol/:assetSymbol  | To retrieve volume and liquidity data for just one pool by asset symbol                    |
| GET        | /lendingApy/:lendingPool          | To retrieve the previous 14 days of lending pool APY data for one pool by contract address |
| GET        | /sov/current-price                | To retrieve the current sov price                                                          |
| GET        | /sov/circulating-supply           | To retrieve data on sov circulating supply                                                 |
| GET        | /sov/circulating-supply-only      | Required by a third party. Returns only the circulating supply value as a string           |
| GET        | /sov/circulating-supply-breakdown | To retrieve underlying data used to calculate circulating supply                           |
| GET        | /sov/total-supply-only            | Required by a third party. Returns the total supply of SOV                                 |

## Dependencies

This service depends on:

- An RSK Node
- The Sovryn Subgraph

## Testing and monitoring

This service is end-to-end tested and monitored using Postman. There is a monitor labelled CMC in Postman that tests the /cmc/ routes. It would be good to add more tests and monitors to this service.

## Database Migrations

1. Generate migration
   To make any changes to a database that is already deployed: `export POSTGRES_HOST=<postgres host> && export POSTGRES_PASSWORD=<password> export POSTGRES_DB=<db name> && npm run migrations:generate -- -n <migration name>`

2. Run migration
   After generating a migration, you can run it on a deployed database by running: `npm run migrations:run`
