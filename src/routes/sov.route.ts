/** These routes support legacy backend api routes that return SOV-specific data */

import express, { NextFunction, Request, Response } from 'express'
import asyncMiddleware from '../utils/asyncMiddleware'
import {
  getSovCirculatingSupply,
  getSovCirculatingSupplyBreakdown,
  getSovCurrentPrice
} from '../controllers/sov.controller'

export const router = express.Router()

router.get(
  '/current-price',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    // Set cache in seconds
    res.set('Cache-control', 'public, max-age=30')
    try {
      req.log.info(req, 'get sov current price data')
      const response = await getSovCurrentPrice()
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/circulating-supply',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    // Set cache in seconds
    res.set('Cache-control', 'public, max-age=300')
    try {
      req.log.info(req, 'get sov current price data')
      const response = await getSovCirculatingSupply()
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/circulating-supply-only',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    // Set cache in seconds
    res.set('Cache-control', 'public, max-age=300')
    try {
      req.log.info(req, 'get sov current price data')
      const response = await getSovCirculatingSupply()
      res.status(200).json(response.circulating_supply)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/circulating-supply-breakdown',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    // Set cache in seconds
    res.set('Cache-control', 'public, max-age=300')
    try {
      req.log.info(req, 'get sov current price data')
      const response = await getSovCirculatingSupplyBreakdown()
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  })
)

router.get(
  '/total-supply-only',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    // Set cache in seconds
    res.set('Cache-control', 'public, max-age=600')
    try {
      req.log.info(req, 'get sov total supply')
      res.status(200).send(Number(100 * 1e6))
    } catch (error) {
      next(error)
    }
  })
)
