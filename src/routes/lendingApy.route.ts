import express, { NextFunction, Request, Response } from 'express'
import { buildCheckFunction, validationResult } from 'express-validator'
import dayjs from 'dayjs'
import asyncMiddleware from '../utils/asyncMiddleware'
import setCacheMiddleware from '../utils/setCacheMiddleware'
import { getPoolApy } from '../controllers/lendingApy.controller'
import { InputValidateError } from '../errorHandlers/baseError'
import { ILendingPoolApyItem } from '../utils/interfaces'

export const router = express.Router()

const checkBodyAndParams = buildCheckFunction(['body', 'params'])

router.get(
  '/:lendingPool',
  checkBodyAndParams('lendingPool')
    .exists()
    .trim()
    .isEthereumAddress()
    .toLowerCase(),
  setCacheMiddleware(30),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info(req, 'get lending pool apy', [req.params.lendingPool])
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        req.log.debug(errors.array(), 'handling message errors')
        throw new InputValidateError(errors.array())
      }
      const pool = req.params.lendingPool
      const response = await getPoolApy(pool)
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  })
)

const format = 'YYYY-MM-DD'

router.get(
  '/:lendingPool/daily',
  checkBodyAndParams('lendingPool')
    .exists()
    .trim()
    .isEthereumAddress()
    .toLowerCase(),
  setCacheMiddleware(30),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info(req, 'get daily lending pool apy', [req.params.lendingPool])
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        req.log.debug(errors.array(), 'handling message errors')
        throw new InputValidateError(errors.array())
      }
      const pool = req.params.lendingPool
      const response = await getPoolApy(pool)
      // group by day
      const groupedByDay = response.reduce<{ [key: string]: ILendingPoolApyItem[] }>((acc, item) => {
        const day = dayjs(item.timestamp).format(format)
        /* eslint no-prototype-builtins: "off" */
        if (!acc.hasOwnProperty(day)) {
          acc[day] = []
        }
        acc[day].push(item)
        return acc
      }, {})

      const items = Object.keys(groupedByDay).map((key) => {
        const item = groupedByDay[key]
        const supply = item[item.length - 1].supply
        const borrow = item[item.length - 1].borrow
        const supplyApr = item.reduce((acc, item) => {
          return acc + parseFloat(String(item.supply_apr))
        }, 0) / item.length
        const borrowApr = item.reduce((acc, item) => {
          return acc + parseFloat(String(item.borrow_apr))
        }, 0) / item.length
        return {
          supply,
          borrow,
          supply_apr: supplyApr.toString(),
          borrow_apr: borrowApr.toString(),
          timestamp: item[0].timestamp
        }
      })

      if (items.length < 2) {
        res.status(200).json(items)
      }

      const filledItems = []
      let currentDate = dayjs(items[0].timestamp)
      const lastDate = dayjs(items[items.length - 1].timestamp)
      while (currentDate.isBefore(lastDate)) {
        const day = currentDate.format(format)
        /* eslint no-prototype-builtins: "off" */
        if (groupedByDay.hasOwnProperty(day)) {
          filledItems.push(...groupedByDay[day])
        } else {
          const previousDay = currentDate.subtract(1, 'day').format(format)
          /* eslint no-prototype-builtins: "off" */
          if (groupedByDay.hasOwnProperty(previousDay)) {
            filledItems.push(...groupedByDay[previousDay])
          }
        }
        currentDate = currentDate.add(1, 'day')
      }

      res.status(200).json(filledItems)
    } catch (error) {
      next(error)
    }
  })
)
