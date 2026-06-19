import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

@Controller({
  path: '',
  version: '1',
})
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('admin/settings')
  getAdmin(@CurrentUser() user: RequestUser) {
    return this.settingsService.getAdmin(user.storeId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/settings')
  update(
    @CurrentUser() user: RequestUser,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    return this.settingsService.update(user.storeId, updateSettingsDto);
  }

  @Get('public/settings')
  getPublic() {
    return this.settingsService.getPublic();
  }
}

