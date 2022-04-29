import { createConnection } from 'typeorm'
import config from './config/config'
import dbConfig from './config/database'
import app from './app'

const { appName, port, env } = config
createConnection(dbConfig)
  .then(() => {
    app.listen(port, () =>
      console.log(
        `${appName}: ${env} Server Now Listening on ${port}. Stay Sovryn.`
      )
    )
  })
  .catch((err) => {
    console.log('Unable to connect to db', err)
    process.exit(1)
  })
