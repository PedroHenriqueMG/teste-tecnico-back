import { User } from "../../entities/User";
import { UserModel, IUser } from "../models/UserModel";

export class UserMapper {
  static toPersistence(user: User): { email: string; password: string } {
    return {
      email: user.email,
      password: user.password,
    };
  }

  static toDomain(raw: IUser): User {
    return new User(
      {
        email: raw.email,
        password: raw.password,
      },
      raw._id?.toString(),
    );
  }
}