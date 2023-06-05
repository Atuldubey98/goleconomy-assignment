import { Router } from "express";
import UserController from "../controllers/user.controller";

const userRouter: Router = Router();

userRouter.post("/register", UserController.registerUser);
export default userRouter;
