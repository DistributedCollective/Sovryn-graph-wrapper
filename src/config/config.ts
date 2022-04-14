import convict from 'convict'

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
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
    default: 'debug',
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
    default: 'postgres',
    env: 'POSTGRES_PASSWORD',
    sensitive: true
  },
  postgresDatabase: {
    doc: 'postgres database',
    format: String,
    default: 'sov-contract-data-main',
    env: 'POSTGRES_DB'
  },
  mainnetSubgraphUrl: {
    doc: 'Mainnet Subgraph',
    format: 'url',
    default:
      'https://subgraph.sovryn.app/subgraphs/name/DistributedCollective/sovryn-subgraph',
    env: 'MAINNET_SUBGRAPH_URL'
  },
  testnetSubgraphUrl: {
    doc: 'Testnet Subgraph',
    format: 'url',
    default:
      'https://subgraph.test.sovryn.app/subgraphs/name/DistributedCollective/sovryn-subgraph',
    env: 'TESTNET_SUBGRAPH_URL'
  },
  RSKMainnet: {
    doc: 'RSK mainnet endpoint',
    format: 'url',
    default: 'https://rsk-graph1.sovryn.app/rpc',
    env: 'RSK_MAINNET'
  },
  RSKTestnet: {
    doc: 'RSK testnet endpoint',
    format: 'url',
    default: 'https://testnet.sovryn.app/rpc',
    env: 'RSK_TESTNET'
  }
})

config.validate({ allowed: 'strict' })

export default config.getProperties()
