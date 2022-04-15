import express, { NextFunction, Request, Response } from 'express'
// import { buildCheckFunction, validationResult, body } from 'express-validator'
import asyncMiddleware from '../utils/asyncMiddleware'
import { getSummaryData } from '../controllers/summary'
import { getAssetData } from '../controllers/asset'
import { getLiquidityData } from '../controllers/liquidity'
import { getTickerData } from '../controllers/ticker'
import { getTvlData } from '../controllers/tvl'

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

router.get(
  '/asset',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info(req, 'get asset data')
      const response = await getAssetData()
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/liquidity',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info(req, 'get liquidity data')
      const response = await getLiquidityData()
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/ticker',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    res.set('Cache-control', 'public, max-age=60')
    try {
      req.log.info(req, 'get ticker data')
      const response = await getTickerData()
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/tvl',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    res.set('Cache-control', 'public, max-age=60')
    try {
      req.log.info(req, 'get tvl data')
      const response = await getTvlData()
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  })
)

// router.get(
//   "/trades",
//   /**TODO... */
//   asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       req.log.info(req, "get asset data");
//       const response = await getTrades("", "");
//       res.status(200).json(response);
//     } catch (error) {
//       next(error);
//     }
//   })
// );
