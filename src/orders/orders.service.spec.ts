import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { SettingsService } from '../settings/settings.service';
import { StoresService } from '../stores/stores.service';
import { OrdersService } from './orders.service';
import { OrderStatus } from './schemas/order.schema';

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

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let orderModel: {
    create: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    countDocuments: jest.Mock;
  };
  let storesService: jest.Mocked<StoresService>;
  let settingsService: jest.Mocked<SettingsService>;
  let productsService: jest.Mocked<ProductsService>;
  let customersService: jest.Mocked<CustomersService>;

  beforeEach(() => {
    orderModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      countDocuments: jest.fn(),
    };

    storesService = {
      findById: jest.fn(),
      findDefaultStore: jest.fn(),
    } as unknown as jest.Mocked<StoresService>;

    settingsService = {
      getAdmin: jest.fn(),
      update: jest.fn(),
      getPublic: jest.fn(),
      getRequiredSettingsForStore: jest.fn(),
    } as unknown as jest.Mocked<SettingsService>;

    productsService = {
      create: jest.fn(),
      listPublic: jest.fn(),
      findPublicBySlug: jest.fn(),
      listAdmin: jest.fn(),
      update: jest.fn(),
      getAvailableProductsForStore: jest.fn(),
    } as unknown as jest.Mocked<ProductsService>;

    customersService = {
      upsertFromOrderInput: jest.fn(),
      registerOrder: jest.fn(),
      listAdmin: jest.fn(),
      findAdminById: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<CustomersService>;

    ordersService = new OrdersService(
      orderModel as never,
      storesService,
      settingsService,
      productsService,
      customersService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a public order with whatsapp payload and snapshots', async () => {
    const storeId = new Types.ObjectId();
    const customerId = new Types.ObjectId();
    const productId = new Types.ObjectId();

    storesService.findDefaultStore.mockResolvedValue({
      _id: storeId,
    } as never);
    settingsService.getRequiredSettingsForStore.mockResolvedValue({
      whatsappNumber: '5592999999999',
      deliveryFeeCents: 500,
    } as never);
    productsService.getAvailableProductsForStore.mockResolvedValue(
      new Map([
        [
          productId.toString(),
          {
            id: productId.toString(),
            name: 'Alface',
            unitLabel: 'un',
            promotionalPriceCents: 999,
            priceCents: 1299,
          },
        ],
      ]) as never,
    );
    customersService.upsertFromOrderInput.mockResolvedValue({
      _id: customerId,
    } as never);
    orderModel.countDocuments.mockResolvedValue(0);
    orderModel.create.mockResolvedValue({
      id: 'order_001',
      orderCode: 'HF-1001',
      status: OrderStatus.PENDING_WHATSAPP_CONFIRMATION,
      subtotalCents: 1998,
      deliveryFeeCents: 500,
      totalCents: 2498,
    });

    const result = await ordersService.createPublic({
      customer: {
        name: 'Maria Souza',
        phone: '+55 (92) 99999-9999',
      },
      deliveryAddress: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'Manaus',
        state: 'AM',
        zipCode: '69000000',
      },
      items: [
        {
          productId: productId.toString(),
          quantity: 2,
        },
      ],
      notes: 'Entregar pela manha',
    });

    expect(result).toEqual(
      expect.objectContaining({
        orderId: 'order_001',
        orderCode: 'HF-1001',
        status: OrderStatus.PENDING_WHATSAPP_CONFIRMATION,
        subtotalCents: 1998,
        deliveryFeeCents: 500,
        totalCents: 2498,
        whatsappUrl: expect.stringContaining('wa.me/5592999999999'),
        whatsappMessage: expect.stringContaining('Pedido HF-1001'),
      }),
    );

    expect(productsService.getAvailableProductsForStore).toHaveBeenCalledWith(
      storeId,
      [productId.toString()],
    );
    expect(customersService.upsertFromOrderInput).toHaveBeenCalledWith(
      storeId,
      {
        name: 'Maria Souza',
        phone: '5592999999999',
      },
      expect.objectContaining({
        street: 'Rua das Flores',
      }),
    );
    expect(customersService.registerOrder).toHaveBeenCalledWith(customerId);
    expect(orderModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        storeId,
        customerId,
        orderCode: 'HF-1001',
        subtotalCents: 1998,
        deliveryFeeCents: 500,
        totalCents: 2498,
        source: 'pwa',
        status: OrderStatus.PENDING_WHATSAPP_CONFIRMATION,
      }),
    );
  });

  it('throws when no active store exists for public order creation', async () => {
    storesService.findDefaultStore.mockResolvedValue(null);

    await expect(
      ordersService.createPublic({
        customer: { name: 'Maria Souza', phone: '92999999999' },
        deliveryAddress: {
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Manaus',
          state: 'AM',
          zipCode: '69000000',
        },
        items: [{ productId: new Types.ObjectId().toString(), quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws when store whatsapp is not configured', async () => {
    const storeId = new Types.ObjectId();
    storesService.findDefaultStore.mockResolvedValue({ _id: storeId } as never);
    settingsService.getRequiredSettingsForStore.mockResolvedValue({
      whatsappNumber: '   ',
    } as never);

    await expect(
      ordersService.createPublic({
        customer: { name: 'Maria Souza', phone: '92999999999' },
        deliveryAddress: {
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Manaus',
          state: 'AM',
          zipCode: '69000000',
        },
        items: [{ productId: new Types.ObjectId().toString(), quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it('throws when customer phone becomes empty after normalization', async () => {
    const storeId = new Types.ObjectId();
    storesService.findDefaultStore.mockResolvedValue({ _id: storeId } as never);
    settingsService.getRequiredSettingsForStore.mockResolvedValue({
      whatsappNumber: '5592999999999',
      deliveryFeeCents: 0,
    } as never);

    await expect(
      ordersService.createPublic({
        customer: { name: 'Maria Souza', phone: '() -' },
        deliveryAddress: {
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Manaus',
          state: 'AM',
          zipCode: '69000000',
        },
        items: [{ productId: new Types.ObjectId().toString(), quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lists admin orders with mapped summary fields', async () => {
    const createdAt = new Date('2026-06-21T12:00:00.000Z');
    const query = createFindQueryMock([
      {
        _id: 'order_001',
        orderCode: 'HF-1001',
        customerSnapshot: { name: 'Maria Souza' },
        status: OrderStatus.CONFIRMED,
        totalCents: 2498,
        createdAt,
      },
    ]);
    orderModel.find.mockReturnValue(query);

    await expect(ordersService.listAdmin('store_001')).resolves.toEqual({
      items: [
        {
          id: 'order_001',
          orderCode: 'HF-1001',
          customerName: 'Maria Souza',
          status: OrderStatus.CONFIRMED,
          totalCents: 2498,
          createdAt,
        },
      ],
      total: 1,
    });
  });

  it('throws when order detail is missing', async () => {
    orderModel.findOne.mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });

    await expect(
      ordersService.findAdminById('store_001', 'order_001'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates order status and saves the document', async () => {
    const order = {
      id: 'order_001',
      status: OrderStatus.PENDING_WHATSAPP_CONFIRMATION,
      save: jest.fn().mockResolvedValue(undefined),
    };
    orderModel.findOne.mockResolvedValue(order);

    await expect(
      ordersService.updateStatus('store_001', 'order_001', {
        status: OrderStatus.CONFIRMED,
      }),
    ).resolves.toEqual({
      id: 'order_001',
      status: OrderStatus.CONFIRMED,
    });

    expect(order.status).toBe(OrderStatus.CONFIRMED);
    expect(order.save).toHaveBeenCalled();
  });
});
