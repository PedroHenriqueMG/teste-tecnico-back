import { Router } from "express";
import { authRouter } from "../../auth/router/authRouter";

export const v1Router = Router();

v1Router.use("/auth", authRouter);