import { Router } from "express";
import { authController } from "../controller/AuthController";

export const authRouter = Router();

authRouter.get("/", (req, res) => authController.getProfile(req, res));
authRouter.post("/register", (req, res) => authController.register(req, res));
authRouter.post("/login", (req, res) => authController.login(req, res));