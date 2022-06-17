import pino from 'pino'
import pinoHttp from 'pino-http'
import config from './config/config'

const { appName, logLevel, env } = config

let isAppName = false
if (appName !== '') isAppName = true

export const logger = pino({
  name: isAppName ? appName : 'sov-graph-wrapper-service',
  level: logLevel,
  prettyPrint: env !== 'production' ? { colorize: true } : false
})

export default pinoHttp({
  logger: logger
})
