import { ApiError } from "../../helpers/api-erros";

export class OrderNotBeUpdated extends ApiError {
  constructor() {
    super("Order not be updated", 400);
  }
}