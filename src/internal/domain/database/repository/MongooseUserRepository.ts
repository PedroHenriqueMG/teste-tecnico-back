import { User } from "../../../domain/entities/User";
import { UserModel } from "../../../domain/database/models/UserModel";
import { UserMapper } from "../../../domain/database/mappers/UserMapper";
import { UserRepository } from "../../../infrastructure/repository/userRepository";

export class MongooseUserRepository implements UserRepository {
  async create(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await UserModel.create(data);
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);
    if (!userDoc) {
      return null;
    }
    return UserMapper.toDomain(userDoc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) {
      return null;
    }
    return UserMapper.toDomain(userDoc);
  }

  async findAll(): Promise<User[]> {
    const userDocs = await UserModel.find();
    return userDocs.map((doc) => UserMapper.toDomain(doc));
  }

  async update(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await UserModel.findByIdAndUpdate(user.id, {
      ...data,
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }
}
