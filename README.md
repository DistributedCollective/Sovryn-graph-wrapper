# Sovryn Graph Wrapper service

## Purpose

This microservice wrappers data from the graph and polled contract calls to support api endpoints for coinmarketcap and stats for the Sovryn dapp.

The reason for this is so that we can parse and cache things like time-travel graph queries, and also so that we can poll contract balances for cases where this is more efficient than storing this data on the graph.

In future, some of the contract calls here may be moved to the graph.

## Overview

This service contains:

1. An express server with routes that can be found in the /src/routes directory
2. Cron jobs to fetch and store data from the graph and from contracts. These are created from an AbstractCronJob and exported as an array from /src/services/cronJobs.ts

The data pulled by the cron jobs in this service is:

- Asset: symbol, asset, circulating supply
- LiquidityPoolSummary: for each liquidity pool, the base asset, quote asset, 24h and week price change in BTC and USD, and 24 hour volume
- Tvl
