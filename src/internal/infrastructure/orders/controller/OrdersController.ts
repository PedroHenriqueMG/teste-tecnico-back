import { Request, Response } from "express";
import { CreateOrderBodySchema } from "../dto/CreateOrderBody";
import { validateBody, validateQuery } from "../../middleware/zod";
import { Parser } from "../../exceptions/Parser";
import { createOrderUseCase, CreateOrderUseCase } from "../useCase/createOrderUseCase/createOrderUseCase";
import { QueryParamsSchema } from "../dto/GetOrdersParams";
import { getAllOrdersUseCase, GetAllOrdersUseCase } from "../useCase/getAllOrdersUseCase/getAllOrdersUseCase";
import { OrderViewModel } from "../viewModel/OrderViewModel";

export class OrdersController {
    constructor(private createOrderUseCase: CreateOrderUseCase, private getAllOrdersUseCase: GetAllOrdersUseCase) {}

    async createOrder(req: Request, res: Response) {
        const body = validateBody(req, CreateOrderBodySchema);
        
            if(body instanceof Array){
              throw new Parser(body.map(msg => msg.message).join(", "));
            }

            const {lab, patient, customer, state, status, services} = body;

            await this.createOrderUseCase.execute({lab, patient, customer, state, status, services});

            return res.status(201).json({ message: "Order created successfully" });
    }

    async getAllOrders(req: Request, res: Response) {
        const query = validateQuery(req, QueryParamsSchema);

        if(query instanceof Array){
            throw new Parser(query.map(msg => msg.message).join(", "));
        }

        const { page, rowPerPage, state } = query;

        const result = await this.getAllOrdersUseCase.execute({state, page, rowPerPage});

        const orders = result.orders.map(order => OrderViewModel.toHTTP(order));
        
        return res.json({ ...result, orders });
    }
}

export const ordersController = new OrdersController(createOrderUseCase, getAllOrdersUseCase);