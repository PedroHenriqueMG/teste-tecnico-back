import { ApiError } from "../helpers/api-erros";

export class Parser extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}