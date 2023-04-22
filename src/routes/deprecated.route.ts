import express, { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import asyncMiddleware from '../utils/asyncMiddleware'
import setCacheMiddleware from '../utils/setCacheMiddleware'
import { InputValidateError } from '../errorHandlers/baseError'

export const router = express.Router()

router.get(
  '/datafeed/price',
  setCacheMiddleware(1000),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info(req, 'get deprecated datafeed endpoint')
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        req.log.debug(errors.array(), 'handling message errors')
        throw new InputValidateError(errors.array())
      }
      const response = {
        error: true,
        message:
          'This API endpoint has now been deprecated. To access Sovryn pricing data, please use the Sovryn Subgraph. \nDocumentation for how to replace this endpoint with subgraph data can be found here: https://github.com/DistributedCollective/Sovryn-subgraph/blob/development/docs/MigrateDatafeedEndpoint.md. \nIf you need help, please reach out to the Sovryn team via our discord: https://discord.com/channels/729675474665603133/',
        statusCode: 410
      }
      res.status(410).json(response)
    } catch (error) {
      next(error)
    }
  })
)
