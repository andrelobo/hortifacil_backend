import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionsService } from './promotions.service';

@Controller({
  path: '',
  version: '1',
})
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('admin/promotions')
  create(
    @CurrentUser() user: RequestUser,
    @Body() createPromotionDto: CreatePromotionDto,
  ) {
    return this.promotionsService.create(user.storeId, createPromotionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/promotions')
  listAdmin(@CurrentUser() user: RequestUser) {
    return this.promotionsService.listAdmin(user.storeId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/promotions/:id')
  update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.promotionsService.update(user.storeId, id, updatePromotionDto);
  }

  @Get('public/promotions')
  listPublic() {
    return this.promotionsService.listPublic();
  }
}

