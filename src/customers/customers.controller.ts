import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('Customers')
@Controller({
  path: '',
  version: '1',
})
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lista clientes da loja',
    description: 'Retorna os clientes cadastrados a partir dos pedidos recebidos.',
  })
  @ApiOkResponse({
    description: 'Clientes retornados com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('admin/customers')
  listAdmin(@CurrentUser() user: RequestUser) {
    return this.customersService.listAdmin(user.storeId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Consulta detalhe de cliente',
    description: 'Retorna os dados completos de um cliente para o painel.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente',
    example: '665f3aa22d7d2c4e9a1c1234',
  })
  @ApiOkResponse({
    description: 'Cliente retornado com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('admin/customers/:id')
  findAdminById(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.customersService.findAdminById(user.storeId, id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualiza cliente',
    description: 'Permite ajustar nome, observacoes e endereco padrao do cliente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente',
    example: '665f3aa22d7d2c4e9a1c1234',
  })
  @ApiOkResponse({
    description: 'Cliente atualizado com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('admin/customers/:id')
  update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(user.storeId, id, updateCustomerDto);
  }
}
