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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller({
  path: '',
  version: '1',
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Cria pedido publico',
    description: 'Recebe os itens do carrinho e gera o pedido com link para confirmacao via WhatsApp.',
  })
  @ApiCreatedResponse({
    description: 'Pedido criado com sucesso.',
  })
  @Post('public/orders')
  createPublic(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createPublic(createOrderDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lista pedidos do painel',
    description: 'Retorna a fila de pedidos da loja para acompanhamento administrativo.',
  })
  @ApiOkResponse({
    description: 'Pedidos administrativos retornados com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('admin/orders')
  listAdmin(@CurrentUser() user: RequestUser) {
    return this.ordersService.listAdmin(user.storeId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Consulta detalhe de pedido',
    description: 'Retorna o pedido completo para visualizacao no painel.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do pedido',
    example: '665f3aa22d7d2c4e9a1c1234',
  })
  @ApiOkResponse({
    description: 'Detalhe do pedido retornado com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('admin/orders/:id')
  findAdminById(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.ordersService.findAdminById(user.storeId, id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualiza status do pedido',
    description: 'Permite mover o pedido pelo fluxo operacional do painel.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do pedido',
    example: '665f3aa22d7d2c4e9a1c1234',
  })
  @ApiOkResponse({
    description: 'Status do pedido atualizado com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
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
