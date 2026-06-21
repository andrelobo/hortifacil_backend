import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller({
  path: '',
  version: '1',
})
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Consulta configuracoes administrativas',
    description: 'Retorna configuracoes completas da loja para o painel.',
  })
  @ApiOkResponse({
    description: 'Configuracoes administrativas retornadas com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('admin/settings')
  getAdmin(@CurrentUser() user: RequestUser) {
    return this.settingsService.getAdmin(user.storeId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualiza configuracoes da loja',
    description: 'Salva dados publicos, visuais e operacionais usados no painel e no catalogo.',
  })
  @ApiOkResponse({
    description: 'Configuracoes atualizadas com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Put('admin/settings')
  update(
    @CurrentUser() user: RequestUser,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    return this.settingsService.update(user.storeId, updateSettingsDto);
  }

  @ApiOperation({
    summary: 'Consulta configuracoes publicas',
    description: 'Retorna os dados publicos da loja exibidos no catalogo.',
  })
  @ApiOkResponse({
    description: 'Configuracoes publicas retornadas com sucesso.',
  })
  @Get('public/settings')
  getPublic() {
    return this.settingsService.getPublic();
  }
}
