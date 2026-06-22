import { NotFoundException } from '@nestjs/common';
import { CustomersService } from './customers.service';

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

describe('CustomersService', () => {
  let customersService: CustomersService;
  let customerModel: {
    findOneAndUpdate: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(() => {
    customerModel = {
      findOneAndUpdate: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    customersService = new CustomersService(customerModel as never);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('upserts customer from order input with normalized phone', async () => {
    const customer = { _id: 'cust_001' };
    customerModel.findOneAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(customer),
    });

    await expect(
      customersService.upsertFromOrderInput(
        'store_001',
        {
          name: 'Maria Souza',
          phone: '+55 (92) 99999-0000',
        },
        {
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Manaus',
          state: 'AM',
          zipCode: '69000000',
        },
      ),
    ).resolves.toBe(customer);

    expect(customerModel.findOneAndUpdate).toHaveBeenCalledWith(
      { storeId: 'store_001', phone: '5592999990000' },
      expect.objectContaining({
        storeId: 'store_001',
        name: 'Maria Souza',
        phone: '5592999990000',
      }),
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  });

  it('registers customer order counters', async () => {
    await customersService.registerOrder('cust_001');

    expect(customerModel.findByIdAndUpdate).toHaveBeenCalledWith('cust_001', {
      $inc: { orderCount: 1 },
      $set: { lastOrderAt: expect.any(Date) },
    });
  });

  it('lists customers for admin view', async () => {
    const query = createFindQueryMock([{ id: 'cust_001' }]);
    customerModel.find.mockReturnValue(query);

    await expect(customersService.listAdmin('store_001')).resolves.toEqual({
      items: [{ id: 'cust_001' }],
      total: 1,
    });

    expect(customerModel.find).toHaveBeenCalledWith({ storeId: 'store_001' });
  });

  it('throws when customer detail is missing', async () => {
    customerModel.findOne.mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });

    await expect(
      customersService.findAdminById('store_001', 'cust_001'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates editable customer fields and saves the document', async () => {
    const customer = {
      name: 'Maria Souza',
      notes: '',
      defaultAddress: {
        street: 'Rua Antiga',
        number: '10',
      },
      save: jest.fn().mockResolvedValue(undefined),
    };
    customerModel.findOne.mockResolvedValue(customer);

    const result = await customersService.update('store_001', 'cust_001', {
      name: 'Maria Souza Premium',
      notes: 'Cliente recorrente',
      defaultAddress: {
        street: 'Rua Nova',
        number: '123',
        neighborhood: 'Centro',
        city: 'Manaus',
        state: 'AM',
        zipCode: '69000000',
      },
    });

    expect(result).toBe(customer);
    expect(customer.name).toBe('Maria Souza Premium');
    expect(customer.notes).toBe('Cliente recorrente');
    expect(customer.defaultAddress).toEqual({
      street: 'Rua Nova',
      number: '123',
      neighborhood: 'Centro',
      city: 'Manaus',
      state: 'AM',
      zipCode: '69000000',
    });
    expect(customer.save).toHaveBeenCalled();
  });
});
