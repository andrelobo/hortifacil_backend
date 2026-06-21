import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { StoresService } from '../stores/stores.service';
import { ProductsService } from './products.service';

function createFindLeanQueryMock<T>(result: T) {
  const exec = jest.fn().mockResolvedValue(result);
  const lean = jest.fn().mockReturnValue({ exec });
  const sort = jest.fn().mockReturnValue({ lean, exec });

  return {
    sort,
    lean,
    exec,
  };
}

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productModel: {
    create: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
  };
  let categoriesService: jest.Mocked<CategoriesService>;
  let storesService: jest.Mocked<StoresService>;

  beforeEach(() => {
    productModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    categoriesService = {
      create: jest.fn(),
      listAdmin: jest.fn(),
      listPublic: jest.fn(),
      update: jest.fn(),
      ensureExistsForStore: jest.fn(),
    } as unknown as jest.Mocked<CategoriesService>;

    storesService = {
      findById: jest.fn(),
      findDefaultStore: jest.fn(),
    } as unknown as jest.Mocked<StoresService>;

    productsService = new ProductsService(
      productModel as never,
      categoriesService,
      storesService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('rejects product creation when promotional price is not lower than base price', async () => {
    await expect(
      productsService.create('store_001', {
        name: 'Tomate',
        unitLabel: 'kg',
        priceCents: 1000,
        promotionalPriceCents: 1000,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates a product with slug and default values', async () => {
    productModel.findOne.mockResolvedValueOnce(null);
    productModel.create.mockResolvedValue({
      id: 'prd_001',
      slug: 'alface-crespa',
    });

    await expect(
      productsService.create('store_001', {
        name: 'Alface Crespa',
        unitLabel: 'un',
        priceCents: 1299,
      }),
    ).resolves.toEqual({
      id: 'prd_001',
      slug: 'alface-crespa',
    });

    expect(productModel.create).toHaveBeenCalledWith({
      storeId: 'store_001',
      name: 'Alface Crespa',
      unitLabel: 'un',
      priceCents: 1299,
      slug: 'alface-crespa',
      promotionalPriceCents: null,
      categoryId: null,
      isAvailable: true,
      isFeatured: false,
      archivedAt: null,
    });
  });

  it('validates category existence before creating a categorized product', async () => {
    productModel.findOne.mockResolvedValueOnce(null);
    productModel.create.mockResolvedValue({ id: 'prd_001' });

    await productsService.create('store_001', {
      name: 'Alface Crespa',
      unitLabel: 'un',
      priceCents: 1299,
      categoryId: '665f3aa22d7d2c4e9a1c1234',
    });

    expect(categoriesService.ensureExistsForStore).toHaveBeenCalledWith(
      'store_001',
      '665f3aa22d7d2c4e9a1c1234',
    );
  });

  it('builds public filters using category, promotion and search', async () => {
    const storeId = new Types.ObjectId();
    const query = createFindLeanQueryMock([{ id: 'prd_001' }]);
    storesService.findDefaultStore.mockResolvedValue({ _id: storeId } as never);
    productModel.find.mockReturnValue(query);

    await expect(
      productsService.listPublic({
        categoryId: '665f3aa22d7d2c4e9a1c1234',
        featured: true,
        promotionOnly: true,
        search: 'alface',
      }),
    ).resolves.toEqual({
      items: [{ id: 'prd_001' }],
    });

    expect(productModel.find).toHaveBeenCalledWith(
      expect.objectContaining({
        storeId,
        isAvailable: true,
        archivedAt: null,
        isFeatured: true,
        promotionalPriceCents: { $ne: null },
        name: { $regex: 'alface', $options: 'i' },
      }),
    );

    const filter = productModel.find.mock.calls[0][0];
    expect(filter.categoryId).toBeInstanceOf(Types.ObjectId);
  });

  it('throws when finding a public product by slug without active store', async () => {
    storesService.findDefaultStore.mockResolvedValue(null);

    await expect(
      productsService.findPublicBySlug('alface-crespa'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates product fields and allows removing category', async () => {
    const product = {
      _id: new Types.ObjectId(),
      name: 'Alface',
      slug: 'alface',
      description: 'Atual',
      unitLabel: 'un',
      priceCents: 1299,
      promotionalPriceCents: 999,
      categoryId: new Types.ObjectId(),
      imageUrl: 'https://old.example/image.jpg',
      isAvailable: true,
      isFeatured: false,
      save: jest.fn().mockResolvedValue(undefined),
    };
    productModel.findOne
      .mockResolvedValueOnce(product)
      .mockResolvedValueOnce(null);

    const result = await productsService.update('store_001', 'prd_001', {
      name: 'Alface Premium',
      description: 'Nova descricao',
      unitLabel: 'kg',
      priceCents: 1599,
      promotionalPriceCents: null,
      categoryId: null,
      imageUrl: 'https://new.example/image.jpg',
      isAvailable: false,
      isFeatured: true,
    });

    expect(result).toBe(product);
    expect(product.slug).toBe('alface-premium');
    expect(product.promotionalPriceCents).toBeNull();
    expect(product.categoryId).toBeNull();
    expect(product.isAvailable).toBe(false);
    expect(product.isFeatured).toBe(true);
    expect(product.save).toHaveBeenCalled();
  });

  it('throws when requested product ids are missing from available list', async () => {
    productModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([
        {
          id: 'prd_001',
        },
      ]),
    });

    await expect(
      productsService.getAvailableProductsForStore('store_001', [
        'prd_001',
        'prd_002',
      ]),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
