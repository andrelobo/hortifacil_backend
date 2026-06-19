import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@Controller({
  path: '',
  version: '1',
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('public/orders')
  createPublic(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createPublic(createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/orders')
  listAdmin(@CurrentUser() user: RequestUser) {
    return this.ordersService.listAdmin(user.storeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/orders/:id')
  findAdminById(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.ordersService.findAdminById(user.storeId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/orders/:id/status')
  updateStatus(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(
      user.storeId,
      id,
      updateOrderStatusDto,
    );
  }
}

