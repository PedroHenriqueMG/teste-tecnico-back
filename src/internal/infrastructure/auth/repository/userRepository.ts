import { User } from "../../../domain/entities/User";

export abstract class UserRepository {
  abstract update(user: User): Promise<void>;
  abstract create(user: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract delete(id: string): Promise<void>;
}