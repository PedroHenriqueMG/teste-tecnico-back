import { Router } from "express";
import { AuthController } from "../controller/AuthController";

export const authRouter = Router();

authRouter.get("/", new AuthController().getProfile);
authRouter.post("/signup", new AuthController().create);
authRouter.post("/login", new AuthController().auth);