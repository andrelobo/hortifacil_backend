import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller({
  path: '',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('admin/categories')
  create(
    @CurrentUser() user: RequestUser,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(user.storeId, createCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/categories')
  listAdmin(@CurrentUser() user: RequestUser) {
    return this.categoriesService.listAdmin(user.storeId);
  }

  @Get('public/categories')
  listPublic() {
    return this.categoriesService.listPublic().then((items) => ({ items }));
  }

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

