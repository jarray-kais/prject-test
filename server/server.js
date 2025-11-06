import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser"; 
import dbconnect from "./config/mongoose.config.js";
import { globalErrorHandler, normalizeErrors, notFoundHandler } from "./utils/errorHandlers.js";
import userRouter from "./routes/user.routes.js";
import projetRouter from "./routes/projet.routes.js";
import reviewRouter from "./routes/review.routes.js";
import { authMiddleware } from "./utils/util.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// route check authentication
app.get('/api/check-auth', authMiddleware , async(req , res , next)=>{
    try {
      if (!req.user) {
        return res.status(401).json({ authenticated: false, message: 'Unauthorized' });
      }
      res.json({ authenticated: true, message: 'User is authenticated' });
    } catch (err) {
      next(err);
    }
  })

// routes

app.use("/api/users", userRouter);
app.use("/api/projets", projetRouter);
app.use("/api/reviews", reviewRouter);

// error handler
app.use(notFoundHandler);
app.use(globalErrorHandler);
app.use(normalizeErrors);



// server
const PORT = process.env.PORT;
app.listen(PORT, async () => {
    await dbconnect();
    console.log(`Server is running on port ${PORT}`);
});