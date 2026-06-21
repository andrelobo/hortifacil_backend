import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Autentica usuario administrativo',
    description: 'Retorna token JWT e dados basicos do usuario e da loja.',
  })
  @ApiCreatedResponse({
    description: 'Login realizado com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais invalidas.',
  })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna a sessao autenticada',
    description: 'Consulta os dados do usuario logado e da loja vinculada.',
  })
  @ApiOkResponse({
    description: 'Sessao carregada com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: RequestUser) {
    return this.authService.me(user);
  }
}
