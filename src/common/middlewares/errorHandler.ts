import { NextFunction, Response, Request } from "express";
import { AppError } from "../../errors/appError";
import { IResponseInterface } from "../interfaces/user";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  const statusCode = err instanceof AppError ? err.statusCode : 500;

  const response: IResponseInterface = {
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
  };

  // attach structured data if it exists
  if (err instanceof AppError && err.details) {
    Object.assign(response, err.details);
  }

  res.status(statusCode).json(response);
};

