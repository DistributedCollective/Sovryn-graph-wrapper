import 'reflect-metadata'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import expressRequestId from 'express-request-id'
import log from './logger'
import { router as cmcRouter } from './routes/cmc.route'
import { router as sovRouter } from './routes/sov.route'
import { router as lendingApyRouter } from './routes/lendingApy.route'
import { router as deprecatedRouter } from './routes/deprecated.route'
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
  req.log.info(req, 'Sovryn Graph Wrapper Service Running. Stay Sovryn.')
  res.send('Sovryn Graph Wrapper Service Running. Stay Sovryn.')
})

app.use('/cmc/', cmcRouter)
app.use('/sov/', sovRouter)
app.use('/lendingApy', lendingApyRouter)
app.use('/deprecated', deprecatedRouter)

app.use(function (_req: Request, res: Response, _next: NextFunction) {
  res.status(404).send("Sorry can't find that!")
})

app.use(function (_req: Request, _res: Response, _next: NextFunction) {
  throw new HTTP404Error()
})

app.use(errorHandler.handleError)

export default app
