import express, { NextFunction, Request, Response } from "express";
// import { buildCheckFunction, validationResult, body } from 'express-validator'
import asyncMiddleware from "../utils/asyncMiddleware";
import { getSummaryData } from "../controllers/summary.controller";
import { getAssetData } from "../controllers/asset.controller";
import { getLiquidityData } from "../controllers/liquidity.controller";
import { getTickerData } from "../controllers/ticker.controller";
import { getTvlData } from "../controllers/tvl.controller";
import setCacheMiddleware from "../utils/setCacheMiddleware";
import { getPoolApy } from "../controllers/lendingApy.controller";

export const router = express.Router();

// const checkBodyAndParams = buildCheckFunction(['body', 'params'])

router.get(
  "/:lendingPool",
  setCacheMiddleware(30),
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.info(req, "get lending pool apy", [req.params.lendingPool]);
      const pool = req.params.lendingPool;
      const response = await getPoolApy(pool);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  })
);
