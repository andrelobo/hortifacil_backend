import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { GetPublicProductsQueryDto } from './dto/get-public-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller({
  path: '',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('admin/products')
  create(
    @CurrentUser() user: RequestUser,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(user.storeId, createProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/products')
  listAdmin(@CurrentUser() user: RequestUser) {
    return this.productsService.listAdmin(user.storeId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/products/:id')
  update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(user.storeId, id, updateProductDto);
  }

  @Get('public/products')
  listPublic(@Query() query: GetPublicProductsQueryDto) {
    return this.productsService.listPublic(query);
  }

  @Get('public/products/:slug')
  findPublicBySlug(@Param('slug') slug: string) {
    return this.productsService.findPublicBySlug(slug);
  }
}

