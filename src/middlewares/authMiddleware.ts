import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../helpers/api-errors";
import { userRepository } from "../repositories/userRepository";
import jwt from "jsonwebtoken";

type jwtPayload = {
  id: number;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthorizedError("Token not provided");
  }

  //console.log(authorization);
  const token = authorization.split(" ")[1];
  //console.log(token);

  const { id } = jwt.verify(token, process.env.JWT_PASS ?? "") as jwtPayload;

  const user = await userRepository.findOneBy({ id });

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  const { password: _, ...userData } = user;

  req.user = userData;

  next();
};
