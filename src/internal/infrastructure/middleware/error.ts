import { NextFunction, Request, Response } from "express";
import { ApiError } from "../helpers/api-erros";
import jwt from "jsonwebtoken";

export const errosMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);

  if (error instanceof jwt.TokenExpiredError) {
        return res.status(403).json({ message: "Token expired" });
      }
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : "Internal server error";
  return res.status(statusCode).json({ message });
};
