import express, { NextFunction, Request, Response } from 'express'
// import { buildCheckFunction, validationResult, body } from 'express-validator'
import asyncMiddleware from '../utils/asyncMiddleware'
import setCacheMiddleware from '../utils/setCacheMiddleware'
import { getPoolApy } from '../controllers/lendingApy.controller'

export const router = express.Router()

// const checkBodyAndParams = buildCheckFunction(['body', 'params'])

router.get(
  '/:lendingPool',
  setCacheMiddleware(30),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info(req, 'get lending pool apy', [req.params.lendingPool])
      const pool = req.params.lendingPool
      const response = await getPoolApy(pool)
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  })
)
