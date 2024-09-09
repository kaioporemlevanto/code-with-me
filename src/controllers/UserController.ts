import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { BadRequestError, UnauthorizedError } from "../helpers/api-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const userExists = await userRepository.findOneBy({ email });

    if (userExists) {
      throw new BadRequestError("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(newUser);

    const { password: _, ...user } = newUser;

    return res.status(201).json(user);
  }

  async getProfile(req: Request, res: Response) {
    return res.json(req.user);
  }
}
