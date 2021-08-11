import 'reflect-metadata'
import cors from 'cors'
import express, { Request, Response } from 'express'
import expressRequestId from 'express-request-id'
import log from './logger'
import config from './config/config'
import { helloSovrynHandler } from './serviceHandlers/helloSovrynHandler'
import { toTheMoonHandler } from './serviceHandlers/toTheMoonHandler'
import { getAll, getUser } from './serviceHandlers/userHandler'
import asyncMiddleware from './utils/asyncMiddleware'
import responseTime from 'response-time'

declare global {
  namespace Express {
    interface Request {
      id: string
    }
  }
}

let { appName } = config
appName = !appName ? '' : `/${appName}`

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(responseTime())
app.use(expressRequestId())

app.get(`${appName}/`, (req, res) => {
  log.info(req, 'Sovryn treasury-dashboard Service DB Read Service Running. Stay Sovryn.')
  res.send('Sovryn treasury-dashboard Service DB Read Service Running. Stay Sovryn.')
})

app.get(`${appName}/test`, (req, res) => {
  log.info(req, 'test')
  res.json({ message: 'Pass!' })
})

app.post(`${appName}/helloSovryn`, asyncMiddleware(async (req: Request, res: Response) => {
  const response = await helloSovrynHandler(req.body)
  console.log('service returned for Hello Sovryn', response)
  res.send(response)
}))

app.post(`${appName}/toTheMoon`, asyncMiddleware(async (req: Request, res: Response) => {
  const response = await toTheMoonHandler(req.body)
  console.log('service returned for To The Moon', response)
  res.send(response)
}))

app.get(`${appName}/user/`, asyncMiddleware(async (req: Request, res: Response) => {
  const logger = log.child({ route: 'user', req_id: req.id }, true)
  logger.info('handling user request')
  const response = await getAll()
  res.send(response)
}))

app.get(`${appName}/user/:id`, asyncMiddleware(async (req: Request, res: Response) => {
  const logger = log.child({ route: 'user', req_id: req.id }, true)
  logger.info(req.body, 'handling user request')
  const response = await getUser(req.params.id)
  res.send(response)
}))

export default app
