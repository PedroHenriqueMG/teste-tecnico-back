import { Router } from "express";
import { authRouter } from "../../auth/router/authRouter";
import { ordersRouter } from "../../orders/router/ordersRouter";

export const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/orders", ordersRouter);