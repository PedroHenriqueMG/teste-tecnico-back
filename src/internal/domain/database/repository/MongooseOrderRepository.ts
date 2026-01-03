import { Order } from "../../../domain/entities/Order";
import { OrderModel } from "../models/OrderModel";
import { OrderMapper } from "../mappers/OrderMapper";
import { OrderRepository } from "../../../infrastructure/repository/orderRepository";

export class MongooseOrderRepository implements OrderRepository {
  async create(order: Order): Promise<void> {
    const data = OrderMapper.toPersistence(order);
    await OrderModel.create(data);
  }

  async findById(id: string): Promise<Order | null> {
    const orderDoc = await OrderModel.findById(id);
    if (!orderDoc) {
      return null;
    }
    return OrderMapper.toDomain(orderDoc);
  }

  async findAll(): Promise<Order[]> {
    const orderDocs = await OrderModel.find();
    return orderDocs.map((doc) => OrderMapper.toDomain(doc));
  }

  async update(order: Order): Promise<void> {
    const data = OrderMapper.toPersistence(order);
    await OrderModel.findByIdAndUpdate(order.id, {
      ...data,
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await OrderModel.findByIdAndDelete(id);
  }
}
