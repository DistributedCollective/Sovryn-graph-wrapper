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
  postgresDatabase,
  cacheTTL
} = config

const dbConfig: ConnectionOptions = {
  type: 'postgres',
  host: postgresHost,
  port: postgresPort,
  username: postgresUser,
  password: postgresPassword,
  database: postgresDatabase,
  cache: {
    duration: cacheTTL
  },
  migrations: ['src/migration/**/*.ts'],
  entities: [LiquidityPoolSummary, Asset, Tvl, IlliquidSov, LendingApy],
  synchronize: false,
  cli: {
    migrationsDir: 'src/migration'
  }
}

export default dbConfig
