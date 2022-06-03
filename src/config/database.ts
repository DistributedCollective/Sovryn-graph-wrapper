import { ConnectionOptions } from 'typeorm'
import {
  LiquidityPoolSummary,
  Asset,
  Tvl,
  IlliquidSov,
  LendingApy
} from '../entity'

import config, { Environment } from './config'
const {
  postgresHost,
  postgresPort,
  postgresUser,
  postgresPassword,
  postgresDatabase,
  env
} = config

const dbConfig: ConnectionOptions = {
  type: 'postgres',
  host: postgresHost,
  port: postgresPort,
  username: postgresUser,
  password: postgresPassword,
  database: postgresDatabase,
  entities: [LiquidityPoolSummary, Asset, Tvl, IlliquidSov, LendingApy],
  synchronize: env === Environment.Development
}

export default dbConfig
