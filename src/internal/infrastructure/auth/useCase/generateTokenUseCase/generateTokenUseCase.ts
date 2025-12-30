import { env } from "../../../../../env";
import { MongooseUserRepository } from "../../../../domain/database/repository/MongooseUserRepository";
import { UserRepository } from "../../../repository/userRepository";
import { LoginBody } from "../../dto/LoginBody";
import { UserInvalid } from "../../exceptions/UserInvalid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export class GenerateTokenUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(user: LoginBody) {
        const foundUser = await this.userRepository.findByEmail(user.email);

        if (!foundUser) {
            throw new UserInvalid();
        }

        const verifyPass = await bcrypt.compare(user.password, foundUser.password);

        if (!verifyPass) {
            throw new UserInvalid();
        }

         const token = jwt.sign({ id: foundUser.id }, env.JWT_PASS ?? " ", {
       expiresIn: "8h",
     });

        return {
            token,
            userData: foundUser,
        };
    }
}

export const generateTokenUseCase = new GenerateTokenUseCase(new MongooseUserRepository());