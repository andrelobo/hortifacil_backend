import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { GetPublicProductsQueryDto } from './dto/get-public-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller({
  path: '',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cria produto administrativo',
    description: 'Cadastra um produto do catalogo com preco, disponibilidade e categoria.',
  })
  @ApiCreatedResponse({
    description: 'Produto criado com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('admin/products')
  create(
    @CurrentUser() user: RequestUser,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(user.storeId, createProductDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lista produtos do painel',
    description: 'Retorna todos os produtos nao arquivados da loja.',
  })
  @ApiOkResponse({
    description: 'Produtos administrativos retornados com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('admin/products')
  listAdmin(@CurrentUser() user: RequestUser) {
    return this.productsService.listAdmin(user.storeId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualiza produto',
    description: 'Permite alterar dados comerciais e operacionais de um produto.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do produto',
    example: '665f3aa22d7d2c4e9a1c1234',
  })
  @ApiOkResponse({
    description: 'Produto atualizado com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('admin/products/:id')
  update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(user.storeId, id, updateProductDto);
  }

  @ApiOperation({
    summary: 'Lista produtos publicos',
    description: 'Consulta o catalogo publico com filtros por categoria, destaque, promocao e busca textual.',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filtra por categoria',
    example: '665f3aa22d7d2c4e9a1c1234',
  })
  @ApiQuery({
    name: 'featured',
    required: false,
    description: 'Retorna apenas produtos em destaque',
    example: true,
    type: Boolean,
  })
  @ApiQuery({
    name: 'promotionOnly',
    required: false,
    description: 'Retorna apenas produtos com preco promocional',
    example: true,
    type: Boolean,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Busca textual por nome',
    example: 'alface',
  })
  @ApiOkResponse({
    description: 'Produtos publicos retornados com sucesso.',
  })
  @Get('public/products')
  listPublic(@Query() query: GetPublicProductsQueryDto) {
    return this.productsService.listPublic(query);
  }

  @ApiOperation({
    summary: 'Consulta produto publico por slug',
    description: 'Retorna o detalhe de um produto publico disponivel para venda.',
  })
  @ApiParam({
    name: 'slug',
    description: 'Slug publico do produto',
    example: 'alface-crespa',
  })
  @ApiOkResponse({
    description: 'Produto publico retornado com sucesso.',
  })
  @Get('public/products/:slug')
  findPublicBySlug(@Param('slug') slug: string) {
    return this.productsService.findPublicBySlug(slug);
  }
}
