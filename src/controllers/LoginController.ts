import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";
import { BadRequestError } from "../helpers/api-errors";

export class LoginController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const userExists = await userRepository.findOneBy({ email });

    if (!userExists) throw new BadRequestError("User not found");

    const verifyPass = await bcrypt.compare(password, userExists.password);

    if (!verifyPass) throw new BadRequestError("User not found");

    const token = jwt.sign({ id: userExists.id }, process.env.JWT_PASS ?? "", {
      expiresIn: "3h",
    });

    const { password: _, ...user } = userExists;

    return res.json({ user, token });
  }
}
