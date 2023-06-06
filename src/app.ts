import express, { Application, NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import mongoose from "mongoose";
import config from "./config";
import userRouter from "./routes/user.routes";
import { TokenExpiredError } from "jsonwebtoken";
const app: Application = express();

mongoose.connect(config.MONGO_URI);
app.use(express.json());
app.get("/api/v1/health", (req: Request, res: Response) => {
  return res.status(200).send("Server is healthy");
});
app.use("/api/v1/users", userRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  const message: string = `${req.originalUrl} does not exists`;
  next(createHttpError(404, message));
});
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let message = "An unknown error occured.";
  let statusCode = 500;
  if (error instanceof mongoose.Error) {
    message = error.message;
    statusCode = 400;
  }
  if (error instanceof TokenExpiredError) {
    message = "TOKEN_EXPIRED";
    statusCode = 403;
  }
  if (isHttpError(error)) {
    message = error.message;
    statusCode = error.statusCode;
  }
  return res.status(statusCode).json({ message });
});
export default app;
