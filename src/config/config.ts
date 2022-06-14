import convict from 'convict'

export enum Environment {
  Production = 'production',
  Development = 'development',
  Test = 'test',
}

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'production',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  appName: {
    doc: 'application name',
    format: String,
    default: 'sov-graph-wrapper-service',
    env: 'APP_NAME'
  },
  logLevel: {
    doc: 'application log level',
    format: String,
    default: 'info',
    env: 'LOG_LEVEL'
  },
  postgresHost: {
    doc: 'postgres host',
    format: String,
    default: 'sov-postgres',
    env: 'POSTGRES_HOST'
  },
  postgresPort: {
    doc: 'postgres port',
    format: 'port',
    default: 5432,
    env: 'POSTGRES_PORT'
  },
  postgresUser: {
    doc: 'postgres user',
    format: String,
    default: 'postgres',
    env: 'POSTGRES_USER'
  },
  postgresPassword: {
    doc: 'postgres password',
    format: '*',
    env: 'POSTGRES_PASSWORD',
    default: '',
    sensitive: true
  },
  postgresDatabase: {
    doc: 'postgres database',
    format: String,
    default: 'sov-graph-wrapper-main',
    env: 'POSTGRES_DB'
  },
  subgraphUrl: {
    doc: 'Url for deployed subgraph',
    format: 'url',
    default:
      'https://subgraph.sovryn.app/subgraphs/name/DistributedCollective/sovryn-subgraph',
    env: 'SUBGRAPH_URL'
  },
  RSKRpc: {
    doc: 'RSK mainnet endpoint',
    format: 'url',
    default: 'https://rsk-graph1.sovryn.app/rpc',
    env: 'RSK_RPC'
  },
  sovTotalSupply: {
    doc: 'Total supply of SOV',
    format: Number,
    default: 100 * 1e6 * 1e18,
    env: 'SOV_TOTAL_SUPPLY'
  },
  stableCoinSymbol: {
    doc: 'Symbol for main USD stablecoin in the protocol',
    format: String,
    default: 'XUSD',
    env: 'STABLECOIN_SYMBOL'
  },
  twoWayPegAddress: {
    doc: 'Address of the RSK 2WP contract',
    format: String,
    default: '0x0000000000000000000000000000000001000006',
    env: 'RSK_2WP'
  },
  ammApyServiceUrl: {
    doc: 'Url for the amm apy microservice',
    format: 'url',
    default: 'http://amm-apy.sovryn.app'
  }
})

config.validate({ allowed: 'strict' })

export default config.getProperties()
