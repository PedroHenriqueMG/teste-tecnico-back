import { User } from "../../../../domain/entities/User";
import { UserRepository } from "../../../repository/userRepository";
import { RegisterBody } from "../../dto/RegisterBody";
import { UserAlreadyExist } from "../../exceptions/UserAlreadyExist";
import { MongooseUserRepository } from "../../../../domain/database/repository/MongooseUserRepository";
import bcrypt from "bcrypt";

export class CreateUserUseCase{
    constructor(private userRepository: UserRepository) {}

    async execute(user: RegisterBody){
        const existUser = await this.userRepository.findByEmail(user.email);
        

        if(existUser){
            throw new UserAlreadyExist();
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const newUser = new User({
            email: user.email,
            password: hashedPassword,
        });

        await this.userRepository.create(newUser);
    }
}

export const createUserUseCase = new CreateUserUseCase(new MongooseUserRepository());