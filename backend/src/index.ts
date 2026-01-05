import "dotenv/config";
import "./config/passport.config";
import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import passport from "passport";
import { Env } from "./config/env.config";
import { HTTP_STATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { BadRequestException } from "./utils/app-error";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import connectDatabase from "./config/database.config";

const app = express();
const BASE_PATH = Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // throw new BadRequestException();
    res.status(HTTP_STATUS.OK).json({
      message: "hello it's working",
    });
  })
);

// routes import

import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";


// routes declaration...

app.use(`${BASE_PATH}/auth`, authRouter);
app.use(`${BASE_PATH}/user`, userRouter);

app.use(errorHandler);

app.listen(Env.PORT, async () => {
  await connectDatabase();
  console.log(
    `Server is running on Port: ${Env.PORT} and in ${Env.NODE_ENV} mode`
  );
});
