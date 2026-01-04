import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateUserUseCase } from './createUserUseCase';
import { UserRepository } from '../../../repository/userRepository';
import { UserAlreadyExist } from '../../exceptions/UserAlreadyExist';
import { User } from '../../../../domain/entities/User';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
    };

    createUserUseCase = new CreateUserUseCase(mockUserRepository);
  });

  it('should successfully create a user', async () => {
    const registerData = {
      email: 'test@test.com',
      password: 'password123',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(undefined);

    await createUserUseCase.execute(registerData);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@test.com');
    expect(mockUserRepository.create).toHaveBeenCalled();
  });

  it('should throw UserAlreadyExist when user email already exists', async () => {
    const registerData = {
      email: 'existing@test.com',
      password: 'password123',
    };

    const existingUser = new User({
      email: 'existing@test.com',
      password: 'hashedpassword',
    });

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(createUserUseCase.execute(registerData)).rejects.toThrow(UserAlreadyExist);
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it('should hash the password before creating user', async () => {
    const registerData = {
      email: 'newuser@test.com',
      password: 'password123',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(undefined);

    await createUserUseCase.execute(registerData);

    const createdUser = mockUserRepository.create.mock.calls[0][0];
    
    expect(createdUser.password).not.toBe('password123');
    expect(createdUser.email).toBe('newuser@test.com');
  });

  it('should create user with correct email', async () => {
    const registerData = {
      email: 'correct@test.com',
      password: 'password123',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(undefined);

    await createUserUseCase.execute(registerData);

    const createdUser = mockUserRepository.create.mock.calls[0][0];
    expect(createdUser.email).toBe('correct@test.com');
  });
});
