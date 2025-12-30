import { Request, Response } from "express";
import { RegisterBodySchema } from "../dto/RegisterBody";
import { createUserUseCase, CreateUserUseCase } from "../useCase/createUserUseCase/createUserUseCase";
import { LoginBodySchema } from "../dto/LoginBody";
import { generateTokenUseCase, GenerateTokenUseCase } from "../useCase/generateTokenUseCase/generateTokenUseCase";
import { UserViewModel } from "../viewModel/UserViewModel";

interface JwtPayLoad {
  id: string;
}


class AuthController {
  constructor(private createUserUseCase: CreateUserUseCase, private generateTokenUseCase: GenerateTokenUseCase) {}

  async login(req: Request, res: Response) {
    const { email, password } = LoginBodySchema.parse(req.body);

    const {token, userData} = await this.generateTokenUseCase.execute({ email, password });

    const user = UserViewModel.toHTTP(userData);

    return res.json({
      token,
      user,
    });
  }

  async getProfile(req: Request, res: Response) {
    // const { authorization } = req.headers;

    // if (!authorization) {
    //   throw new UnauthorizedError("Faça login para ter acesso a essa rota");
    // }

    // const token = authorization.split(" ")[1];

    // const { id } = jwt.verify(token, process.env.JWT_PASS ?? " ") as JwtPayLoad;

    // const user = await prisma.users.findUnique({
    //   where: {
    //     id: id,
    //   },
    // });

    // if (!user) {
    //   throw new UnauthorizedError("Faça login para ter acesso a essa rota");
    // }

    // const { password: _, ...loggedUser } = user;

    // return res.json(loggedUser);
  }

  async register(req: Request, res: Response) {
    const { email, password } = RegisterBodySchema.parse(req.body);

    await this.createUserUseCase.execute({ email, password });

    return res.status(201).json({ message: "User created successfully" });
  }
}

export const authController = new AuthController(createUserUseCase, generateTokenUseCase);
