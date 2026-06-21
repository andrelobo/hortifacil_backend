import { ConflictException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { StoresService } from '../stores/stores.service';
import { CategoriesService } from './categories.service';

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

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoryModel: {
    create: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
  };
  let storesService: jest.Mocked<StoresService>;

  beforeEach(() => {
    categoryModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    storesService = {
      findById: jest.fn(),
      findDefaultStore: jest.fn(),
    } as unknown as jest.Mocked<StoresService>;

    categoriesService = new CategoriesService(
      categoryModel as never,
      storesService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a category with slug and default flags', async () => {
    categoryModel.findOne.mockResolvedValueOnce(null);
    categoryModel.create.mockResolvedValue({
      id: 'cat_001',
      slug: 'folhas-frescas',
    });

    await expect(
      categoriesService.create('store_001', {
        name: 'Folhas Frescas',
      }),
    ).resolves.toEqual({
      id: 'cat_001',
      slug: 'folhas-frescas',
    });

    expect(categoryModel.create).toHaveBeenCalledWith({
      storeId: 'store_001',
      name: 'Folhas Frescas',
      slug: 'folhas-frescas',
      description: undefined,
      sortOrder: 0,
      isActive: true,
      archivedAt: null,
    });
  });

  it('throws when creating a duplicated category slug', async () => {
    categoryModel.findOne.mockResolvedValueOnce({ id: 'existing' });

    await expect(
      categoriesService.create('store_001', {
        name: 'Folhas Frescas',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns public categories for the default active store', async () => {
    const storeId = new Types.ObjectId();
    const query = createFindQueryMock([{ id: 'cat_001' }]);
    storesService.findDefaultStore.mockResolvedValue({ _id: storeId } as never);
    categoryModel.find.mockReturnValue(query);

    await expect(categoriesService.listPublic()).resolves.toEqual([
      { id: 'cat_001' },
    ]);

    expect(categoryModel.find).toHaveBeenCalledWith({
      storeId,
      isActive: true,
      archivedAt: null,
    });
  });

  it('throws when no default store exists for public categories', async () => {
    storesService.findDefaultStore.mockResolvedValue(null);

    await expect(categoriesService.listPublic()).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates name and slug when category title changes', async () => {
    const category = {
      _id: new Types.ObjectId(),
      name: 'Folhas',
      slug: 'folhas',
      description: 'Antiga',
      sortOrder: 1,
      isActive: true,
      save: jest.fn().mockResolvedValue(undefined),
    };
    categoryModel.findOne
      .mockResolvedValueOnce(category)
      .mockResolvedValueOnce(null);

    const result = await categoriesService.update('store_001', 'cat_001', {
      name: 'Folhas Nobres',
      description: 'Atualizada',
      sortOrder: 2,
      isActive: false,
    });

    expect(result).toBe(category);
    expect(category.name).toBe('Folhas Nobres');
    expect(category.slug).toBe('folhas-nobres');
    expect(category.description).toBe('Atualizada');
    expect(category.sortOrder).toBe(2);
    expect(category.isActive).toBe(false);
    expect(category.save).toHaveBeenCalled();
  });

  it('throws when ensuring a category for store that does not exist', async () => {
    categoryModel.findOne.mockResolvedValue(null);

    await expect(
      categoriesService.ensureExistsForStore('store_001', 'cat_001'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
