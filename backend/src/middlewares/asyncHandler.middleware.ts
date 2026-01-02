import { NextFunction, Request, RequestHandler, Response } from "express";

// export const asyncHandler = (controller: RequestHandler): RequestHandler => {
//   return async (req, res, next) => {
//     try {
//       await controller(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
// };

export const asyncHandler =
  (controller: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(controller(req, res, next)).catch(next);
