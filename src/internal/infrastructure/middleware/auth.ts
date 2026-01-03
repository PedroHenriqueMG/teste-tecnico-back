import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { MongooseUserRepository } from "../../domain/database/repository/MongooseUserRepository";
import { Unauthorized } from "../exceptions/Unauthorized";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const userRepository = new MongooseUserRepository();

  if (!authorization) {
    throw new Unauthorized();
  }

  const token = authorization.split(" ")[1];

  const { id } = jwt.verify(token, process.env.JWT_PASS ?? "") as JwtPayload;

    const user = await userRepository.findById(id);

  if (!user) {
    throw new Unauthorized();
  }

  const { password: _, ...userData } = user;

  req.user = userData;

  next();
};