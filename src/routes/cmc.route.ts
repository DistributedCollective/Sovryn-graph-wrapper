import express, { NextFunction, Request, Response } from 'express'
// import { buildCheckFunction, validationResult, body } from 'express-validator'
import asyncMiddleware from '../utils/asyncMiddleware'
import { getSummaryData } from '../controllers/summary'

export const router = express.Router()

// const checkBodyAndParams = buildCheckFunction(['body', 'params'])

router.get(
  '/summary',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info(req, 'get summary data')
      const response = await getSummaryData()
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  })
)
