import { ApiError } from "../helpers/api-erros";

export class Unauthorized extends ApiError {
  constructor() {
    super("Faça login para acessar essa rota", 401);
  }
}