import { Order } from "../../domain/entities/Order";

export abstract class OrderRepository {
  abstract update(order: Order): Promise<Order>;
  abstract create(order: Order): Promise<void>;
  abstract findById(id: string): Promise<Order | null>;
  abstract findAll(): Promise<Order[]>;
  abstract delete(id: string): Promise<void>;
}