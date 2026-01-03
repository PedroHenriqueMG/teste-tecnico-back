import { Order } from "../../entities/Order";
import { IOrder, IService, OrderState, OrderStatus, ServiceStatus } from "../models/OrderModel";

export class OrderMapper {
  static toPersistence(order: Order): {
    lab: string;
    patient: string;
    customer: string;
    state: OrderState;
    status: OrderStatus;
    services: IService[];
  } {
    return {
      lab: order.lab,
      patient: order.patient,
      customer: order.customer,
      state: order.state as OrderState,
      status: order.status as OrderStatus,
      services: order.services.map(s => ({
        name: s.name,
        value: s.value,
        status: s.status as ServiceStatus,
      })),
    };
  }

  static toDomain(raw: IOrder): Order {
    return new Order(
      {
        lab: raw.lab,
        patient: raw.patient,
        customer: raw.customer,
        state: raw.state as OrderState,
        status: raw.status as OrderStatus,
        services: raw.services.map(s => ({
          name: s.name,
          value: s.value,
          status: s.status as ServiceStatus,
        })),
      },
      raw._id?.toString(),
    );
  }
}
