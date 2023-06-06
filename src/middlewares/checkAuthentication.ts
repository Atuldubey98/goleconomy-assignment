import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import config from "../config";
export default async function checkAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.headers.authorization || "";

    if (authorizationHeader.substring(0, 6) !== "Bearer") {
      throw createHttpError(401, "UNAUTHORIZED");
    }
    const accessToken = authorizationHeader.substring(7);
    const userPayload = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);

    //@ts-ignore
    req.user = userPayload;
    next();
  } catch (error) {
    next(error);
  }
}
