import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GenerateTokenUseCase } from './generateTokenUseCase';
import { UserRepository } from '../../../repository/userRepository';
import { UserInvalid } from '../../exceptions/UserInvalid';
import { User } from '../../../../domain/entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('GenerateTokenUseCase', () => {
  let generateTokenUseCase: GenerateTokenUseCase;
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
    };

    generateTokenUseCase = new GenerateTokenUseCase(mockUserRepository);
    vi.clearAllMocks();
  });

  it('should successfully generate a token', async () => {
    const loginData = {
      email: 'test@test.com',
      password: 'password123',
    };

    const foundUser = new User({
      email: 'test@test.com',
      password: '$2b$10$hashedpassword',
    });

    mockUserRepository.findByEmail.mockResolvedValue(foundUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(jwt.sign).mockReturnValue('valid_token' as never);

    const result = await generateTokenUseCase.execute(loginData);

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('userData');
    expect(result.token).toBe('valid_token');
    expect(result.userData).toBe(foundUser);
  });

  it('should throw UserInvalid when user not found', async () => {
    const loginData = {
      email: 'nonexistent@test.com',
      password: 'password123',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(generateTokenUseCase.execute(loginData)).rejects.toThrow(UserInvalid);
  });

  it('should throw UserInvalid when password is incorrect', async () => {
    const loginData = {
      email: 'test@test.com',
      password: 'wrongpassword',
    };

    const foundUser = new User({
      email: 'test@test.com',
      password: '$2b$10$hashedpassword',
    });

    mockUserRepository.findByEmail.mockResolvedValue(foundUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(generateTokenUseCase.execute(loginData)).rejects.toThrow(UserInvalid);
  });

  it('should call findByEmail with correct email', async () => {
    const loginData = {
      email: 'test@test.com',
      password: 'password123',
    };

    const foundUser = new User({
      email: 'test@test.com',
      password: '$2b$10$hashedpassword',
    });

    mockUserRepository.findByEmail.mockResolvedValue(foundUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(jwt.sign).mockReturnValue('valid_token' as never);

    await generateTokenUseCase.execute(loginData);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@test.com');
  });

  it('should call bcrypt.compare with correct parameters', async () => {
    const loginData = {
      email: 'test@test.com',
      password: 'password123',
    };

    const foundUser = new User({
      email: 'test@test.com',
      password: '$2b$10$hashedpassword',
    });

    mockUserRepository.findByEmail.mockResolvedValue(foundUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(jwt.sign).mockReturnValue('valid_token' as never);

    await generateTokenUseCase.execute(loginData);

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', '$2b$10$hashedpassword');
  });

  it('should sign token with user id', async () => {
    const loginData = {
      email: 'test@test.com',
      password: 'password123',
    };

    const foundUser = new User({
      email: 'test@test.com',
      password: '$2b$10$hashedpassword',
    });

    mockUserRepository.findByEmail.mockResolvedValue(foundUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(jwt.sign).mockReturnValue('valid_token' as never);

    await generateTokenUseCase.execute(loginData);

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: foundUser.id },
      expect.any(String),
      { expiresIn: '8h' }
    );
  });
});
