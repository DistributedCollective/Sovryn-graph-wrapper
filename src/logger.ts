// import { createLogger, LogLevel } from 'bunyan'
import pino from 'pino'
import pinoHttp from 'pino-http'
import config from './config/config'

const { appName, logLevel, env } = config

export const logger = pino({
  name: appName || 'sov-boilerplate-service',
  level: logLevel,
  prettyPrint: env !== 'production' ? { colorize: true } : false
})

export default pinoHttp({
  logger: logger
})
