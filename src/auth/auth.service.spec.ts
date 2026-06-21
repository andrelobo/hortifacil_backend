import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { StoresService } from '../stores/stores.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let storesService: jest.Mocked<StoresService>;
  let jwtService: jest.Mocked<JwtService>;
  let compareMock: jest.MockedFunction<typeof bcrypt.compare>;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      updateLastLogin: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    storesService = {
      findById: jest.fn(),
      findDefaultStore: jest.fn(),
    } as unknown as jest.Mocked<StoresService>;

    jwtService = {
      signAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    authService = new AuthService(usersService, storesService, jwtService);
    compareMock = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns token, user and store on successful login', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'usr_001',
      storeId: {
        toString: () => 'store_001',
      },
      name: 'Administrador',
      email: 'admin@loja.com',
      role: 'admin',
      passwordHash: 'hashed-password',
      isActive: true,
    } as never);
    storesService.findById.mockResolvedValue({
      id: 'store_001',
      name: 'HortiFácil Demo',
      isActive: true,
    } as never);
    jwtService.signAsync.mockResolvedValue('jwt-token');
    compareMock.mockResolvedValue(true as never);

    const result = await authService.login({
      email: 'admin@loja.com',
      password: 'senhaSegura',
    });

    expect(result).toEqual({
      accessToken: 'jwt-token',
      expiresIn: 28800,
      user: {
        id: 'usr_001',
        name: 'Administrador',
        email: 'admin@loja.com',
        role: 'admin',
        storeId: 'store_001',
      },
      store: {
        id: 'store_001',
        name: 'HortiFácil Demo',
      },
    });
    expect(usersService.updateLastLogin).toHaveBeenCalledWith('usr_001');
  });

  it('throws UnauthorizedException when user is not found', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'missing@loja.com',
        password: 'senhaSegura',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws ForbiddenException when user is inactive', async () => {
    usersService.findByEmail.mockResolvedValue({
      isActive: false,
    } as never);

    await expect(
      authService.login({
        email: 'admin@loja.com',
        password: 'senhaSegura',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('throws UnauthorizedException when password does not match', async () => {
    usersService.findByEmail.mockResolvedValue({
      passwordHash: 'hashed-password',
      isActive: true,
    } as never);
    compareMock.mockResolvedValue(false as never);

    await expect(
      authService.login({
        email: 'admin@loja.com',
        password: 'senhaErrada',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
