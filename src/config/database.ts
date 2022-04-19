import { ConnectionOptions } from 'typeorm'
import { LiquidityPoolSummary, Asset, Tvl, IlliquidSov } from '../entity'

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
  entities: [LiquidityPoolSummary, Asset, Tvl, IlliquidSov],
  synchronize: true
}

export default dbConfig
