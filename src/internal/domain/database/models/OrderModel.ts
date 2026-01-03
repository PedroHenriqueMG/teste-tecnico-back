import mongoose, { Schema, Document } from "mongoose";

export enum OrderState {
  CREATED = "CREATED",
  ANALYSIS = "ANALYSIS",
  COMPLETED = "COMPLETED",
}

export enum OrderStatus {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
}

export enum ServiceStatus {
  PENDING = "PENDING",
  DONE = "DONE",
}

export interface IService {
  name: string;
  value: number;
  status: ServiceStatus;
}

export interface IOrder extends Document {
  lab: string;
  patient: string;
  customer: string;
  state: OrderState;
  status: OrderStatus;
  services: IService[];
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ServiceStatus),
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    lab: {
      type: String,
      required: true,
    },
    patient: {
      type: String,
      required: true,
    },
    customer: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: Object.values(OrderState),
      default: OrderState.CREATED,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.ACTIVE,
      required: true,
    },
    services: {
      type: [serviceSchema],
      required: true,
      validate: {
        validator: function (v: IService[]) {
          return v && v.length > 0;
        },
        message: "Services array is required and must not be empty",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.model<IOrder>("Order", orderSchema);
