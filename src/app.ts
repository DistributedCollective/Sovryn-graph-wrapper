import 'reflect-metadata'
import cors from 'cors'
import express, { Request, Response } from 'express'
import helmet from 'helmet'
import expressRequestId from 'express-request-id'
import log from './logger'
import config from './config/config'
import { helloSovrynHandler } from './serviceHandlers/helloSovrynHandler'
import { toTheMoonHandler } from './serviceHandlers/toTheMoonHandler'
import { getAll, getUser, createUser } from './serviceHandlers/userHandler'
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
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(responseTime())
app.use(expressRequestId())
app.use(log)

app.get(`${appName}/`, (req, res) => {
  req.log.info(req, 'Sovryn treasury-dashboard Service DB Read Service Running. Stay Sovryn.')
  res.send('Sovryn treasury-dashboard Service DB Read Service Running. Stay Sovryn.')
})

app.get(`${appName}/test`, (req, res) => {
  req.log.info(req, 'test')
  res.json({ message: 'Pass!' })
})

app.post(`${appName}/helloSovryn`, asyncMiddleware(async (req: Request, res: Response) => {
  req.log.info(req, 'handling request for Hello Sovryn')
  const response = await helloSovrynHandler(req.body)
  res.send(response)
}))

app.post(`${appName}/toTheMoon`, asyncMiddleware(async (req: Request, res: Response) => {
  const response = await toTheMoonHandler(req.body)
  req.log.info(response, 'service returned for To The Moon')
  res.send(response)
}))

app.get(`${appName}/user/`, asyncMiddleware(async (req: Request, res: Response) => {
  req.log.info('handling user request')
  const response = await getAll()
  res.send(response)
}))

app.get(`${appName}/user/:id`, asyncMiddleware(async (req: Request, res: Response) => {
  req.log.info(req.body, 'handling user request')
  const response = await getUser(req.params.id)
  res.send(response)
}))

app.post(`${appName}/user`, asyncMiddleware(async (req: Request, res: Response) => {
  req.log.info(req.body, 'handling user request')
  const response = await createUser(req.body)
  res.send(response)
}))

export default app
