import { Request, Response } from "express";
import { CreateOrderBodySchema } from "../dto/CreateOrderBody";
import { validate } from "../../middleware/zod";
import { Parser } from "../../exceptions/Parser";
import { createOrderUseCase, CreateOrderUseCase } from "../useCase/createOrderUseCase/createOrderUseCase";

export class OrdersController {
    constructor(private createOrderUseCase: CreateOrderUseCase) {}

    async createOrder(req: Request, res: Response) {
        const body = validate(req, CreateOrderBodySchema);
        
            if(body instanceof Array){
              throw new Parser(body.map(msg => msg.message).join(", "));
            }

            await this.createOrderUseCase.execute(body);

            return res.status(201).json({ message: "Order created successfully" });
    }
}

export const ordersController = new OrdersController(createOrderUseCase);