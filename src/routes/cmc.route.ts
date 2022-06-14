import express, { NextFunction, Request, Response } from 'express'
import { buildCheckFunction, validationResult } from 'express-validator'
import asyncMiddleware from '../utils/asyncMiddleware'
import { getSummaryData } from '../controllers/summary.controller'
import { getAssetData } from '../controllers/asset.controller'
import { getLiquidityData } from '../controllers/liquidity.controller'
import { getTickerData } from '../controllers/ticker.controller'
import { getTvlData } from '../controllers/tvl.controller'
import { InputValidateError } from '../errorHandlers/baseError'
import setCacheMiddleware from '../utils/setCacheMiddleware'
import { getPoolData } from '../controllers/ammPoolData.controller'

export const router = express.Router()

const checkBodyAndParams = buildCheckFunction(['body', 'params'])

router.get(
  '/summary',
  setCacheMiddleware(30),
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
  setCacheMiddleware(120),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info(req, 'get asset data')
      const response = await getAssetData(req.log)
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/liquidity',
  setCacheMiddleware(120),
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
  setCacheMiddleware(60),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
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
  setCacheMiddleware(60),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info(req, 'get tvl data')
      const response = await getTvlData()
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/ammPool/symbol/:assetSymbol',
  checkBodyAndParams('assetSymbol').exists().trim().isString(),
  setCacheMiddleware(30),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info(req, 'get amm pool data', [req.params.assetSymbol])
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        req.log.debug(errors.array(), 'handling message errors')
        throw new InputValidateError(errors.array())
      }
      const symbol = req.params.assetSymbol
      const response = await getPoolData(symbol, 'symbol')
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/ammPool/address/:address',
  checkBodyAndParams('address').exists().isEthereumAddress(),
  setCacheMiddleware(30),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info(req, 'get amm pool data', [req.params.address])
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        req.log.debug(errors.array(), 'handling message errors')
        throw new InputValidateError(errors.array())
      }
      const address = req.params.address
      const response = await getPoolData(address, 'address')
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
