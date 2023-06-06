import { NextFunction, Request, Response } from "express";
import User, { UserModelType } from "../models/user.model";
import createHttpError from "http-errors";
import * as bcryptjs from "bcryptjs";
import jwt, { VerifyErrors } from "jsonwebtoken";
import config from "../config";
import RefreshToken from "../models/refreshToken.model";

export type AuthenticatedUser = {
  _id: string;
  email: string;
  name: string;
};
class UserController {
  /**
   * register
   */
  /**
   * async
   */
  public static async generateRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createHttpError(401, "USER_REFRESH_TOKEN_PAYLOAD_ERROR");
      }
      const tokenExists = await RefreshToken.findOne({
        token: refreshToken,
      });
      if (!tokenExists) {
        throw createHttpError(403, "USER_REFRESH_TOKEN_VALIDATION_ERROR");
      }
      jwt.verify(
        refreshToken,
        config.REFRESH_TOKEN_SECRET,
        async (error: any, userPayload: any) => {
          if (error) {
            throw createHttpError(403, "USER_REFRESH_TOKEN_VALIDATION_ERROR");
          }
          const { iat, exp, ...user } = userPayload;
          const accessToken = jwt.sign(
            user,
            config.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "120s",
            }
          );
          return res.status(200).send({ accessToken });
        }
      );
    } catch (error) {
      next(error);
    }
  }
  public static async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, email, password }: UserModelType = req.body;

      if (!email || !password || !name) {
        throw createHttpError(400, "USER_PAYLOAD_ERROR");
      }
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw createHttpError(400, "USER_EMAIL_ALREADY_EXISTS");
      }
      const passwordHash = await bcryptjs.hash(
        password,
        await bcryptjs.genSalt(10)
      );
      const user = new User({ name, email, password: passwordHash });
      await user.save();
      return res.status(201).send({
        data: { email, name, _id: user._id },
        message: "USER_REGISTRATION_SUCCESS",
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * currentUser
   */
  public static async currentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    //@ts-ignore
    return res.status(200).send(req.user);
  }
  public static async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw createHttpError(400, "USER_PAYLOAD_ERROR");
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw createHttpError(400, "USER_EMAIL_NOT_FOUND");
      }
      const hasPasswordMatched: boolean = await bcryptjs.compare(
        password,
        user.password.toString()
      );
      if (!hasPasswordMatched) {
        throw createHttpError(400, "USER_PASSWORD_ERROR");
      }
      const authenticatedUser: AuthenticatedUser = {
        email,
        _id: user._id.toString(),
        name: user.name,
      };
      const accessToken = jwt.sign(
        authenticatedUser,
        config.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );
      const refreshToken = jwt.sign(
        authenticatedUser,
        config.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );
      const tokenExists = await RefreshToken.findOne({ userId: user.id });
      if (tokenExists) {
        await RefreshToken.findByIdAndUpdate(tokenExists.id, {
          token: refreshToken,
        });
      } else {
        const token = new RefreshToken({
          token: refreshToken,
          userId: user.id,
        });
        token.save();
      }
      return res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default UserController;
