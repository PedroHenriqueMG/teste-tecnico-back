import e, { Request, Response } from "express";
import { RegisterBodySchema } from "../dto/RegisterBody";
import { createUserUseCase, CreateUserUseCase } from "../useCase/createUserUseCase/createUserUseCase";
import { LoginBodySchema } from "../dto/LoginBody";
import { generateTokenUseCase, GenerateTokenUseCase } from "../useCase/generateTokenUseCase/generateTokenUseCase";
import { UserViewModel } from "../viewModel/UserViewModel";
import { validateBody } from "../../middleware/zod";
import { Parser } from "../../exceptions/Parser";

class AuthController {
  constructor(private createUserUseCase: CreateUserUseCase, private generateTokenUseCase: GenerateTokenUseCase) {}

  async login(req: Request, res: Response) {
    const body = validateBody(req, LoginBodySchema);

    if(body instanceof Array){
      throw new Parser(body.map(msg => msg.message).join(", "));
    }

    const { email, password } = body;

    const {token, userData} = await this.generateTokenUseCase.execute({ email, password });

    const user = UserViewModel.toHTTP(userData);

    return res.json({
      token,
      user,
    });
  }

  async register(req: Request, res: Response) {
    const body = validateBody(req, RegisterBodySchema);

    if(body instanceof Array){
      throw new Parser(body.map(msg => msg.message).join(", "));
    }

    const { email, password } = body;

    await this.createUserUseCase.execute({ email, password });

    return res.status(201).json({ message: "User created successfully" });
  }
}

export const authController = new AuthController(createUserUseCase, generateTokenUseCase);
