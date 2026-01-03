import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { ordersController } from "../controller/OrdersController";

export const ordersRouter = Router();

ordersRouter.use(authMiddleware)
ordersRouter.post("/", (req, res) => ordersController.createOrder(req, res));