import { MongooseOrderRepository } from "../../../../domain/database/repository/MongooseOrderRepository";
import { Order } from "../../../../domain/entities/Order";
import { OrderRepository } from "../../../repository/orderRepository";
import { CreateOrderBody } from "../../dto/CreateOrderBody";

export class CreateOrderUseCase {
    constructor(private orderRepository: OrderRepository) {}

    async execute(order: CreateOrderBody) {
         const newOrder = new Order({
            customer: order.customer,
            lab: order.lab,
            patient: order.patient,
            services: order.services,
         })

        await this.orderRepository.create(newOrder);
    }
}

export const createOrderUseCase = new CreateOrderUseCase(new MongooseOrderRepository());