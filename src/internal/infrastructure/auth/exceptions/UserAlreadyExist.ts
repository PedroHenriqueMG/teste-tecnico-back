import { ApiError } from "../../helpers/api-erros";

export class UserAlreadyExist extends ApiError {
  constructor() {
    super("User already exists", 409);
  }
}