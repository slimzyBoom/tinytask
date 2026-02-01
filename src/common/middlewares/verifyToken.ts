import { validate_access_token } from "../../auth/auth.service";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../errors/appError";

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    next(new AppError("Unauthorized", 401));
    return;
  }
  try {
    const decoded = validate_access_token(token);
    if (!decoded) {
      next(new AppError("Invalid token", 401));
      return;
    }
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError("Unauthorized", 401));
  }
};
