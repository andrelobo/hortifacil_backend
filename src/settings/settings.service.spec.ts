import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { StoresService } from '../stores/stores.service';
import { SettingsService } from './settings.service';

function createLeanExecMock<T>(result: T) {
  const exec = jest.fn().mockResolvedValue(result);
  const lean = jest.fn().mockReturnValue({ exec });

  return {
    lean,
    exec,
  };
}

describe('SettingsService', () => {
  let settingsService: SettingsService;
  let settingsModel: {
    findOne: jest.Mock;
    findOneAndUpdate: jest.Mock;
  };
  let storesService: jest.Mocked<StoresService>;

  beforeEach(() => {
    settingsModel = {
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };

    storesService = {
      findById: jest.fn(),
      findDefaultStore: jest.fn(),
    } as unknown as jest.Mocked<StoresService>;

    settingsService = new SettingsService(
      settingsModel as never,
      storesService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns admin settings when store configuration exists', async () => {
    const settings = {
      storeName: 'HortiFacil Demo',
      whatsappNumber: '5592999999999',
    };
    const query = createLeanExecMock(settings);
    settingsModel.findOne.mockReturnValue(query);

    await expect(settingsService.getAdmin('store_001')).resolves.toEqual(
      settings,
    );
    expect(settingsModel.findOne).toHaveBeenCalledWith({ storeId: 'store_001' });
    expect(query.lean).toHaveBeenCalled();
  });

  it('throws when admin settings are missing', async () => {
    const query = createLeanExecMock(null);
    settingsModel.findOne.mockReturnValue(query);

    await expect(settingsService.getAdmin('store_001')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('applies defaults when updating store settings', async () => {
    const updateResult = {
      storeName: 'HortiFacil Demo',
      whatsappNumber: '5592999999999',
      primaryColor: '#2F855A',
      deliveryFeeCents: 0,
      minimumOrderCents: 0,
      businessHours: '',
    };
    settingsModel.findOneAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(updateResult),
    });

    const payload = {
      storeName: 'HortiFacil Demo',
      whatsappNumber: '5592999999999',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'Manaus',
        state: 'AM',
        zipCode: '69000000',
      },
    };

    await expect(
      settingsService.update('store_001', payload),
    ).resolves.toEqual(updateResult);

    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { storeId: 'store_001' },
      expect.objectContaining({
        storeId: 'store_001',
        primaryColor: '#2F855A',
        deliveryFeeCents: 0,
        minimumOrderCents: 0,
        businessHours: '',
      }),
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  });

  it('rejects blank whatsapp numbers during update', async () => {
    await expect(
      settingsService.update('store_001', {
        storeName: 'HortiFacil Demo',
        whatsappNumber: '   ',
        address: {
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Manaus',
          state: 'AM',
          zipCode: '69000000',
        },
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns public settings for the default store', async () => {
    const storeId = new Types.ObjectId();
    const store = { _id: storeId };
    const settings = {
      storeName: 'HortiFacil Demo',
      whatsappNumber: '5592999999999',
      logoUrl: 'https://cdn.hortifacil.com/logo.png',
      primaryColor: '#2F855A',
      deliveryFeeCents: 500,
      minimumOrderCents: 3000,
      businessHours: 'Seg a Sab 07:00-18:00',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'Manaus',
        state: 'AM',
        zipCode: '69000000',
      },
      internalOnly: 'ignore-me',
    };
    const query = createLeanExecMock(settings);
    storesService.findDefaultStore.mockResolvedValue(store as never);
    settingsModel.findOne.mockReturnValue(query);

    await expect(settingsService.getPublic()).resolves.toEqual({
      storeName: settings.storeName,
      whatsappNumber: settings.whatsappNumber,
      logoUrl: settings.logoUrl,
      primaryColor: settings.primaryColor,
      deliveryFeeCents: settings.deliveryFeeCents,
      minimumOrderCents: settings.minimumOrderCents,
      businessHours: settings.businessHours,
      address: settings.address,
    });
    expect(settingsModel.findOne).toHaveBeenCalledWith({ storeId });
  });

  it('throws when no default store exists for public settings', async () => {
    storesService.findDefaultStore.mockResolvedValue(null);

    await expect(settingsService.getPublic()).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
