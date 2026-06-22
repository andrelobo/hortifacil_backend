import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { StoresService } from '../stores/stores.service';
import { PromotionsService } from './promotions.service';

function createFindQueryMock<T>(result: T) {
  const exec = jest.fn().mockResolvedValue(result);
  const lean = jest.fn().mockReturnValue({ exec });
  const sort = jest.fn().mockReturnValue({ lean, exec });

  return {
    sort,
    lean,
    exec,
  };
}

describe('PromotionsService', () => {
  let promotionsService: PromotionsService;
  let promotionModel: {
    create: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
  };
  let storesService: jest.Mocked<StoresService>;

  beforeEach(() => {
    promotionModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    storesService = {
      findById: jest.fn(),
      findDefaultStore: jest.fn(),
    } as unknown as jest.Mocked<StoresService>;

    promotionsService = new PromotionsService(
      promotionModel as never,
      storesService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates promotions with mapped dates, relations and defaults', async () => {
    promotionModel.create.mockResolvedValue({ id: 'promo_001' });

    await expect(
      promotionsService.create('store_001', {
        title: 'Oferta do Dia',
        productIds: ['665f3aa22d7d2c4e9a1c1234'],
        categoryIds: ['665f3aa22d7d2c4e9a1c5678'],
        startsAt: '2026-06-21T08:00:00.000Z',
        endsAt: '2026-06-22T08:00:00.000Z',
      }),
    ).resolves.toEqual({ id: 'promo_001' });

    expect(promotionModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        storeId: 'store_001',
        title: 'Oferta do Dia',
        isActive: true,
        startsAt: new Date('2026-06-21T08:00:00.000Z'),
        endsAt: new Date('2026-06-22T08:00:00.000Z'),
      }),
    );

    const payload = promotionModel.create.mock.calls[0][0];
    expect(payload.productIds[0]).toBeInstanceOf(Types.ObjectId);
    expect(payload.categoryIds[0]).toBeInstanceOf(Types.ObjectId);
  });

  it('rejects invalid promotion periods', async () => {
    await expect(
      promotionsService.create('store_001', {
        title: 'Oferta Invalida',
        startsAt: '2026-06-22T08:00:00.000Z',
        endsAt: '2026-06-21T08:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns active public promotions for the default store', async () => {
    const storeId = new Types.ObjectId();
    const query = createFindQueryMock([{ id: 'promo_001' }]);
    storesService.findDefaultStore.mockResolvedValue({ _id: storeId } as never);
    promotionModel.find.mockReturnValue(query);

    await expect(promotionsService.listPublic()).resolves.toEqual({
      items: [{ id: 'promo_001' }],
    });

    expect(promotionModel.find).toHaveBeenCalledWith(
      expect.objectContaining({
        storeId,
        isActive: true,
        startsAt: { $lte: expect.any(Date) },
        endsAt: { $gte: expect.any(Date) },
      }),
    );
  });

  it('throws when listing public promotions without active store', async () => {
    storesService.findDefaultStore.mockResolvedValue(null);

    await expect(promotionsService.listPublic()).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates promotion fields and relation arrays', async () => {
    const promotion = {
      title: 'Oferta Antiga',
      description: 'Descricao antiga',
      bannerUrl: 'https://old.example/banner.png',
      productIds: [],
      categoryIds: [],
      startsAt: new Date('2026-06-21T08:00:00.000Z'),
      endsAt: new Date('2026-06-22T08:00:00.000Z'),
      isActive: false,
      save: jest.fn().mockResolvedValue(undefined),
    };
    promotionModel.findOne.mockResolvedValue(promotion);

    const result = await promotionsService.update('store_001', 'promo_001', {
      title: 'Oferta Nova',
      description: 'Descricao nova',
      bannerUrl: 'https://new.example/banner.png',
      productIds: ['665f3aa22d7d2c4e9a1c1234'],
      categoryIds: ['665f3aa22d7d2c4e9a1c5678'],
      startsAt: '2026-06-21T10:00:00.000Z',
      endsAt: '2026-06-23T10:00:00.000Z',
      isActive: true,
    });

    expect(result).toBe(promotion);
    expect(promotion.title).toBe('Oferta Nova');
    expect(promotion.description).toBe('Descricao nova');
    expect(promotion.bannerUrl).toBe('https://new.example/banner.png');
    expect(promotion.productIds[0]).toBeInstanceOf(Types.ObjectId);
    expect(promotion.categoryIds[0]).toBeInstanceOf(Types.ObjectId);
    expect(promotion.startsAt).toEqual(
      new Date('2026-06-21T10:00:00.000Z'),
    );
    expect(promotion.endsAt).toEqual(new Date('2026-06-23T10:00:00.000Z'));
    expect(promotion.isActive).toBe(true);
    expect(promotion.save).toHaveBeenCalled();
  });
});
