import { ConnectionOptions } from 'typeorm'
import { SummaryPairData, Asset } from '../entity'

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
  entities: [SummaryPairData, Asset],
  synchronize: true
}

export default dbConfig
