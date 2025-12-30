import { ApiError } from "../../helpers/api-erros";

export class UserInvalid extends ApiError {
  constructor() {
    super("Email or password is invalid", 400);
  }
}