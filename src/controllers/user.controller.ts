import { NextFunction, Request, Response } from "express";
import User, { UserModelType } from "../models/user.model";
import createHttpError from "http-errors";
import * as bcryptjs from "bcryptjs";
class UserController {
  /**
   * register
   */
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
}
export default UserController;
