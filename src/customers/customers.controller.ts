import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller({
  path: '',
  version: '1',
})
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('admin/customers')
  listAdmin(@CurrentUser() user: RequestUser) {
    return this.customersService.listAdmin(user.storeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/customers/:id')
  findAdminById(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.customersService.findAdminById(user.storeId, id);
  }

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

