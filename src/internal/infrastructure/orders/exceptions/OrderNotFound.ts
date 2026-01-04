import { ApiError } from "../../helpers/api-erros";

export class OrderNotFound extends ApiError {
  constructor() {
    super("Order not found", 404);
  }
}