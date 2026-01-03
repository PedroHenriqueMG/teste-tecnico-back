import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";

export const ordersRouter = Router();

ordersRouter.use(authMiddleware)