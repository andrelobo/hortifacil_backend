import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { StoresService } from '../stores/stores.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly storesService: StoresService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Usuario inativo');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    const store = await this.storesService.findById(user.storeId);

    if (!store || !store.isActive) {
      throw new ForbiddenException('Loja inativa ou nao encontrada');
    }

    const payload: JwtPayload = {
      sub: user.id,
      storeId: user.storeId.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    await this.usersService.updateLastLogin(user.id);

    return {
      accessToken,
      expiresIn: 60 * 60 * 8,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: user.storeId.toString(),
      },
      store: {
        id: store.id,
        name: store.name,
      },
    };
  }

  async me(user: RequestUser) {
    const fullUser = await this.usersService.findById(user.sub);
    const store = await this.storesService.findById(user.storeId);

    if (!fullUser || !store) {
      throw new UnauthorizedException('Sessao invalida');
    }

    return {
      user: {
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        role: fullUser.role,
        storeId: fullUser.storeId.toString(),
      },
      store: {
        id: store.id,
        name: store.name,
      },
    };
  }
}
