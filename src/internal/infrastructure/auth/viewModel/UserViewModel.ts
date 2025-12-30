import { User } from "../../../domain/entities/User";

export class UserViewModel {
  static toHTTP(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
