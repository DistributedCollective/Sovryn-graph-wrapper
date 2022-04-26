import { NextFunction, Request, Response } from 'express'

const setCacheMiddleware =
  (seconds: number) => (_req: Request, res: Response, next: NextFunction) => {
    res.set('Cache-control', `public, max-age=${seconds.toString()}`)
    return next()
  }

export default setCacheMiddleware
