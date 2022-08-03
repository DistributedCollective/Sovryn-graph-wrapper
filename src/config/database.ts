import { ConnectionOptions } from 'typeorm'
import {
  LiquidityPoolSummary,
  Asset,
  Tvl,
  IlliquidSov,
  LendingApy
} from '../entity'

import config from './config'
const {
  postgresHost,
  postgresPort,
  postgresUser,
  postgresPassword,
  postgresDatabase
} = config

const dbConfig: ConnectionOptions = {
  type: 'postgres',
  host: postgresHost,
  port: postgresPort,
  username: postgresUser,
  password: postgresPassword,
  database: postgresDatabase,
  migrations: ['src/migration/**/*.ts'],
  entities: [LiquidityPoolSummary, Asset, Tvl, IlliquidSov, LendingApy],
  synchronize: true,
  cli: {
    migrationsDir: 'src/migration'
  }
}

export default dbConfig
