import { ConnectionOptions } from 'typeorm'
import { LiquidityPoolSummary, Asset, Tvl, IlliquidSov } from '../entity'

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
  entities: [LiquidityPoolSummary, Asset, Tvl, IlliquidSov],
  synchronize: env === Environment.Development,
  cli: {
    migrationsDir: 'src/migration'
  },
  migrations: ['src/migration/**/*.ts']
}

export default dbConfig
