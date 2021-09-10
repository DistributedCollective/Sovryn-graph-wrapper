import { NextFunction, Request, Response } from 'express'
import { BaseError } from './baseError'
import config from '../config/config'

const { env } = config

class ErrorHandler {
  public async handleError (err: BaseError, req: Request, res: Response, _next: NextFunction): Promise<void> {
    res.status(err.statusCode).json({
      message: err.message,
      error: err,
      stack: env !== 'production' ? err.stack : null
    })
    req.log.error(
      err,
      err.message
    )
    // await sendMailToAdminIfCritical();
    // await sendEventsToSentry();
  }

  public isTrustedError (error: Error): boolean {
    if (error instanceof BaseError) {
      return error.isOperational
    }
    return false
  }
}
export default new ErrorHandler()
