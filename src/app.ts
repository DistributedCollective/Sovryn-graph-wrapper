import 'reflect-metadata'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import expressRequestId from 'express-request-id'
import log from './logger'
import { helloSovrynHandler } from './services/helloSovrynHandler'
import { toTheMoonHandler } from './services/toTheMoonHandler'
import { getAll, getUser, createUser } from './services/userHandler'
import asyncMiddleware from './utils/asyncMiddleware'
import responseTime from 'response-time'
import errorHandler from './errorHandlers/errorHandler'
import { HTTP404Error } from './errorHandlers/baseError'

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(responseTime())
app.use(expressRequestId())
app.use(log)

app.get('/', (req, res) => {
  req.log.info(
    req,
    'Sovryn boilerplate Service DB Read Service Running. Stay Sovryn.'
  )
  res.send('Sovryn boilerplate Service DB Read Service Running. Stay Sovryn.')
})

app.get('/test', (req, res) => {
  req.log.info(req, 'test')
  res.json({ message: 'Pass!' })
})

app.post(
  '/helloSovryn',
  asyncMiddleware(async (req: Request, res: Response) => {
    req.log.info(req, 'handling request for Hello Sovryn')
    const response = await helloSovrynHandler(req.body)
    res.send(response)
  })
)

app.post(
  '/toTheMoon',
  asyncMiddleware(async (req: Request, res: Response) => {
    const response = await toTheMoonHandler(req.body)
    req.log.info(response, 'service returned for To The Moon')
    res.send(response)
  })
)

app.get(
  '/user/',
  asyncMiddleware(async (req: Request, res: Response) => {
    req.log.info('handling user request')
    const response = await getAll()
    res.send(response)
  })
)

app.get(
  '/user/:id',
  asyncMiddleware(async (req: Request, res: Response) => {
    req.log.info(req.body, 'handling user request')
    const response = await getUser(req.params.id)
    res.send(response)
  })
)

app.post(
  '/user',
  asyncMiddleware(async (req: Request, res: Response) => {
    req.log.info(req.body, 'handling user request')
    const response = await createUser(req.body)
    res.send(response)
  })
)

app.use(function (_req: Request, res: Response, _next: NextFunction) {
  res.status(404).send("Sorry can't find that!")
})

app.use(function (_req: Request, _res: Response, _next: NextFunction) {
  throw new HTTP404Error()
})

app.use(errorHandler.handleError)

export default app
