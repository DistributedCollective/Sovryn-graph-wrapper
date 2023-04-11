# Sovryn Graph Wrapper service

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

### lendingApy.service.ts

### summary.service.ts

### tvl.service.ts

## API Endpoints

| HTTP Verbs | Endpoints                        | Action                                                                                     |
| ---------- | -------------------------------- | ------------------------------------------------------------------------------------------ |
| GET        | /cmc/summary                     | To retrieve data on all trading pairs and asset prices                                     |
| GET        | /cmc/asset                       | To retrieve data on all individual AMM-traded assets                                       |
| GET        | /cmc/liquidity                   | To retrieve balances of each AMM pool                                                      |
| GET        | /cmc/ticker                      | To retrieve price and volume data for all trading pairs                                    |
| GET        | /cmc/ammPool/symbol/:assetSymbol | To retrieve volume and liquidity data for just one pool by asset symbol                    |
| GET        | /lendingApy/:lendingPool         | To retrieve the previous 14 days of lending pool APY data for one pool by contract address |
| GET        | /lendingApy/:lendingPool         | To retrieve the previous 14 days of lending pool APY data for one pool by contract address |
| GET        | /sov/current-price               | To retrieve the current sov price                                                          |
| GET        | /sov/                            | To retrieve                                                                                |

## Dependencies

This service depends on:

- An RSK Node
- The Sovryn Subgraph

## Database Migrations

1. Generate migration
   To make any changes to a database that is already deployed: `export POSTGRES_HOST=<postgres host> && export POSTGRES_PASSWORD=<password> export POSTGRES_DB=<db name> && npm run migrations:generate -- -n <migration name>`

2. Run migration
   After generating a migration, you can run it on a deployed database by running: `npm run migrations:run`
