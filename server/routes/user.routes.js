import { Router } from "express";
import UserControler from "../controllers/User.controller.js";


const userRouter = Router();

userRouter.route("/register").post(UserControler.register );
userRouter.route("/login").post(UserControler.login);
userRouter.route("/logout").post(UserControler.logout)

export default userRouter;