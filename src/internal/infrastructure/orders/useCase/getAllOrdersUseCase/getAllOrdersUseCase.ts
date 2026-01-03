import { MongooseOrderRepository } from "../../../../domain/database/repository/MongooseOrderRepository";
import { Order } from "../../../../domain/entities/Order";
import { OrderRepository } from "../../../repository/orderRepository";
import { GetOrdersParams } from "../../dto/GetOrdersParams";

export interface PaginatedOrders {
  page: number;
  rowPerPage: number;
  total: number;
  orders: Order[];
}

export class GetAllOrdersUseCase { 
    constructor(private orderRepository: OrderRepository) {}

    async execute(params: GetOrdersParams): Promise<PaginatedOrders> {
        const allOrders = await this.orderRepository.findAll();
        
        let filteredOrders = allOrders;
        if (params.state) {
            filteredOrders = allOrders.filter(order => order.state === params.state);
        }

        const total = filteredOrders.length;

        const startIndex = (params.page - 1) * params.rowPerPage;
        const endIndex = startIndex + params.rowPerPage;
        const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

        return {
            page: params.page,
            rowPerPage: params.rowPerPage,
            total,
            orders: paginatedOrders,
        };
    }
}

export const getAllOrdersUseCase = new GetAllOrdersUseCase(new MongooseOrderRepository());