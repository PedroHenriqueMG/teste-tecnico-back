import { UserModel } from "../internal/domain/database/models/UserModel";

declare global {
  namespace Express {
    export interface Request {
      user: Partial<UserModel>;
    }
  }
}