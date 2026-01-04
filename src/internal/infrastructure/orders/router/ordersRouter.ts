import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { ordersController } from "../controller/OrdersController";

export const ordersRouter = Router();

ordersRouter.use(authMiddleware)
ordersRouter.post("/", (req, res) => ordersController.createOrder(req, res));
ordersRouter.get("/", (req, res) => ordersController.getAllOrders(req, res));
ordersRouter.patch("/:id/advance", (req, res) => ordersController.updateStatus(req, res));