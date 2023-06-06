import { Router } from "express";
import UserController from "../controllers/user.controller";
import checkAuthentication from "../middlewares/checkAuthentication";

const userRouter: Router = Router();

userRouter.post("/login", UserController.loginUser);
userRouter.post("/register", UserController.registerUser);
userRouter.get("/", checkAuthentication, UserController.currentUser);
userRouter.post("/refresh-token", UserController.generateRefreshToken);
export default userRouter;
