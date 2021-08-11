import { createLogger, LogLevel } from 'bunyan'
import config from './config/config'

const { appName, logLevel, env } = config

export default createLogger({
  name: appName || 'sov-notification-service-db-read',
  level: logLevel as LogLevel,
  src: env !== 'production'
})
