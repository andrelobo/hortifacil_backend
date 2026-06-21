import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionsService } from './promotions.service';

@ApiTags('Promotions')
@Controller({
  path: '',
  version: '1',
})
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cria promocao',
    description: 'Cadastra uma promocao com periodo de vigencia e vinculos opcionais a produtos e categorias.',
  })
  @ApiCreatedResponse({
    description: 'Promocao criada com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('admin/promotions')
  create(
    @CurrentUser() user: RequestUser,
    @Body() createPromotionDto: CreatePromotionDto,
  ) {
    return this.promotionsService.create(user.storeId, createPromotionDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lista promocoes do painel',
    description: 'Retorna as promocoes cadastradas para gerenciamento administrativo.',
  })
  @ApiOkResponse({
    description: 'Promocoes administrativas retornadas com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('admin/promotions')
  listAdmin(@CurrentUser() user: RequestUser) {
    return this.promotionsService.listAdmin(user.storeId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualiza promocao',
    description: 'Permite ajustar dados, periodo, itens vinculados e status da promocao.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da promocao',
    example: '665f3aa22d7d2c4e9a1c1234',
  })
  @ApiOkResponse({
    description: 'Promocao atualizada com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('admin/promotions/:id')
  update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.promotionsService.update(user.storeId, id, updatePromotionDto);
  }

  @ApiOperation({
    summary: 'Lista promocoes publicas',
    description: 'Retorna apenas promocoes ativas e dentro do periodo de vigencia.',
  })
  @ApiOkResponse({
    description: 'Promocoes publicas retornadas com sucesso.',
  })
  @Get('public/promotions')
  listPublic() {
    return this.promotionsService.listPublic();
  }
}
