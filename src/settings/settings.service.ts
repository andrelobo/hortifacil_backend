import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StoresService } from '../stores/stores.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Settings, SettingsDocument } from './schemas/settings.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
    private readonly storesService: StoresService,
  ) {}

  async getAdmin(storeId: string) {
    const settings = await this.settingsModel.findOne({ storeId }).lean().exec();

    if (!settings) {
      throw new NotFoundException('Configuracoes nao encontradas');
    }

    return settings;
  }

  async update(storeId: string, updateSettingsDto: UpdateSettingsDto) {
    if (!updateSettingsDto.whatsappNumber.trim()) {
      throw new BadRequestException('WhatsApp da loja e obrigatorio');
    }

    const settings = await this.settingsModel
      .findOneAndUpdate(
        { storeId },
        {
          storeId,
          ...updateSettingsDto,
          deliveryFeeCents: updateSettingsDto.deliveryFeeCents ?? 0,
          minimumOrderCents: updateSettingsDto.minimumOrderCents ?? 0,
          primaryColor: updateSettingsDto.primaryColor ?? '#2F855A',
          businessHours: updateSettingsDto.businessHours ?? '',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .exec();

    return settings;
  }

  async getPublic() {
    const store = await this.storesService.findDefaultStore();

    if (!store) {
      throw new NotFoundException('Nenhuma loja ativa encontrada');
    }

    return this.getPublicByStoreId(store._id);
  }

  async getRequiredSettingsForStore(storeId: string | Types.ObjectId) {
    const settings = await this.settingsModel.findOne({ storeId }).exec();

    if (!settings) {
      throw new NotFoundException('Configuracoes da loja nao encontradas');
    }

    return settings;
  }

  private async getPublicByStoreId(storeId: Types.ObjectId) {
    const settings = await this.settingsModel.findOne({ storeId }).lean().exec();

    if (!settings) {
      throw new NotFoundException('Configuracoes publicas nao encontradas');
    }

    return {
      storeName: settings.storeName,
      whatsappNumber: settings.whatsappNumber,
      logoUrl: settings.logoUrl,
      primaryColor: settings.primaryColor,
      deliveryFeeCents: settings.deliveryFeeCents,
      minimumOrderCents: settings.minimumOrderCents,
      businessHours: settings.businessHours,
      address: settings.address,
    };
  }
}

