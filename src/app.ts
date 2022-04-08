import "reflect-metadata";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import expressRequestId from "express-request-id";
import log from "./logger";
import { router as cmcRouter } from "./routes/cmc.route";
import responseTime from "response-time";
import errorHandler from "./errorHandlers/errorHandler";
import { HTTP404Error } from "./errorHandlers/baseError";
import { summaryDataScheduledTask } from "./services/summary";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTime());
app.use(expressRequestId());
app.use(log);

summaryDataScheduledTask.cronJob.start();

app.get("/", (req, res) => {
  req.log.info(
    req,
    "Sovryn boilerplate Service DB Read Service Running. Stay Sovryn."
  );
  res.send("Sovryn boilerplate Service DB Read Service Running. Stay Sovryn.");
});

app.get("/test", (req, res) => {
  req.log.info(req, "test");
  res.json({ message: "Pass!" });
});

app.use("/cmc/", cmcRouter);

app.use(function (_req: Request, res: Response, _next: NextFunction) {
  res.status(404).send("Sorry can't find that!");
});

app.use(function (_req: Request, _res: Response, _next: NextFunction) {
  throw new HTTP404Error();
});

app.use(errorHandler.handleError);

export default app;
