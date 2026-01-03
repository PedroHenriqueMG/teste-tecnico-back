import { Order } from "../../../domain/entities/Order";

export class OrderViewModel {
    static toHTTP(order: Order) {
        return {
            id: order.id,
            lab: order.lab,
            patient: order.patient,
            customer: order.customer,
            state: order.state,
            status: order.status,
            services: order.services.map(s => ({
                name: s.name,
                value: s.value,
                status: s.status,
            })),
        }
    }
}