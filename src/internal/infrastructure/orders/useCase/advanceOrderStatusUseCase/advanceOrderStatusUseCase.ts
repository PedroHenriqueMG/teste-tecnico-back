import { MongooseOrderRepository } from "../../../../domain/database/repository/MongooseOrderRepository";
import { OrderRepository } from "../../../repository/orderRepository";
import { OrderNotBeUpdated } from "../../exceptions/OrderNotBeUpdated";
import { OrderNotFound } from "../../exceptions/OrderNotFound";

export class AdvanceOrderStatusUseCase {
    private stateSequence: Array<'CREATED' | 'ANALYSIS' | 'COMPLETED'> = ['CREATED', 'ANALYSIS', 'COMPLETED'];

    constructor(private orderRepository: OrderRepository) {}

    async execute(id: string) {
        const order = await this.orderRepository.findById(id);

        if (!order) {
            throw new OrderNotFound();
        }

        const currentStateIndex = this.stateSequence.indexOf(order.state);

        if (currentStateIndex === this.stateSequence.length - 1) {
            throw new OrderNotBeUpdated();
        }

        const nextStateIndex = currentStateIndex + 1;
        order.state = this.stateSequence[nextStateIndex];

        const updatedOrder = await this.orderRepository.update(order);

        return updatedOrder;
    }
}

export const advanceOrderStatusUseCase = new AdvanceOrderStatusUseCase(new MongooseOrderRepository());