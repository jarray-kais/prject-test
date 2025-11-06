import { Router } from "express";
import UserControler from "../controllers/User.controller.js";
import { authMiddleware, isAdmin } from "../utils/util.js";


const userRouter = Router();

userRouter.route("/register").post(UserControler.register );
userRouter.route("/login").post(UserControler.login);
userRouter.route("/logout").post(UserControler.logout)
userRouter.route("/all").get(authMiddleware, isAdmin, UserControler.getAllUsers)
userRouter.route("/delete/:id").delete(authMiddleware, isAdmin, UserControler.deleteUser)

export default userRouter;