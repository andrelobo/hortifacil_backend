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
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller({
  path: '',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cria categoria administrativa',
    description: 'Cadastra uma nova categoria para organizacao do catalogo.',
  })
  @ApiCreatedResponse({
    description: 'Categoria criada com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('admin/categories')
  create(
    @CurrentUser() user: RequestUser,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(user.storeId, createCategoryDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lista categorias do painel',
    description: 'Retorna todas as categorias nao arquivadas da loja.',
  })
  @ApiOkResponse({
    description: 'Categorias administrativas retornadas com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('admin/categories')
  listAdmin(@CurrentUser() user: RequestUser) {
    return this.categoriesService.listAdmin(user.storeId);
  }

  @ApiOperation({
    summary: 'Lista categorias publicas',
    description: 'Retorna apenas categorias ativas visiveis no catalogo.',
  })
  @ApiOkResponse({
    description: 'Categorias publicas retornadas com sucesso.',
  })
  @Get('public/categories')
  listPublic() {
    return this.categoriesService.listPublic().then((items) => ({ items }));
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualiza categoria',
    description: 'Permite alterar nome, descricao, ordem e status de uma categoria.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
    example: '665f3aa22d7d2c4e9a1c1234',
  })
  @ApiOkResponse({
    description: 'Categoria atualizada com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('admin/categories/:id')
  update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(user.storeId, id, updateCategoryDto);
  }
}
