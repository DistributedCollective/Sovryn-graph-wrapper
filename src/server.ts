import { createConnection } from 'typeorm'
import config from './config/config'
import dbConfig from './config/database'

const { appName, port } = config
import app from './app'
createConnection(dbConfig).then(() => {
  app.listen(port, () =>
    console.log(`${appName} Server Now Listening on ${port}. Stay Sovryn.`)
  )
})
  .catch((err) => {
    console.log("Unable to connect to db", err)
    process.exit(1)
  })
