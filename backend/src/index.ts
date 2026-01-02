import "dotenv/config";
import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import { Env } from "./config/env.config";
import { HTTP_STATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { BadRequestException } from "./utils/app-error";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException();
    res.status(HTTP_STATUS.OK).json({
      message: "hello it's working",
    });
  })
);  

app.use(errorHandler);

app.listen(Env.PORT, () => {
  console.log(
    `Server is running on Port: ${Env.PORT} and in ${Env.NODE_ENV} mode`
  );
});
