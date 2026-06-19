import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { formatAddressLine } from '../common/utils/address.util';
import {
  buildWhatsappMessage,
  buildWhatsappUrl,
} from '../common/utils/whatsapp.util';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { SettingsService } from '../settings/settings.service';
import { StoresService } from '../stores/stores.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly storesService: StoresService,
    private readonly settingsService: SettingsService,
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
  ) {}

  async createPublic(createOrderDto: CreateOrderDto) {
    const store = await this.storesService.findDefaultStore();

    if (!store) {
      throw new NotFoundException('Nenhuma loja ativa encontrada');
    }

    const settings = await this.settingsService.getRequiredSettingsForStore(
      store._id,
    );

    if (!settings.whatsappNumber?.trim()) {
      throw new UnprocessableEntityException(
        'WhatsApp da loja nao configurado',
      );
    }

    const normalizedPhone = createOrderDto.customer.phone.replace(/\D/g, '');

    if (!normalizedPhone) {
      throw new BadRequestException('Telefone do cliente e obrigatorio');
    }

    const productIds = createOrderDto.items.map((item) => item.productId);
    const productMap = await this.productsService.getAvailableProductsForStore(
      store._id,
      productIds,
    );

    const itemsSnapshot = createOrderDto.items.map((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new BadRequestException(
          `Produto indisponivel ou inexistente: ${item.productId}`,
        );
      }

      const unitPriceCents =
        product.promotionalPriceCents ?? product.priceCents;
      const lineTotalCents = unitPriceCents * item.quantity;

      return {
        productId: new Types.ObjectId(product.id),
        name: product.name,
        unitLabel: product.unitLabel,
        unitPriceCents,
        quantity: item.quantity,
        lineTotalCents,
      };
    });

    const subtotalCents = itemsSnapshot.reduce(
      (total, item) => total + item.lineTotalCents,
      0,
    );
    const deliveryFeeCents = settings.deliveryFeeCents ?? 0;
    const totalCents = subtotalCents + deliveryFeeCents;

    const customer = await this.customersService.upsertFromOrderInput(
      store._id,
      {
        name: createOrderDto.customer.name,
        phone: normalizedPhone,
      },
      createOrderDto.deliveryAddress,
    );

    const orderCode = await this.generateOrderCode(store._id);
    const addressLine = formatAddressLine(createOrderDto.deliveryAddress);
    const whatsappMessage = buildWhatsappMessage({
      orderCode,
      customerName: createOrderDto.customer.name,
      items: itemsSnapshot.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        lineTotalCents: item.lineTotalCents,
      })),
      totalCents,
      addressLine,
      notes: createOrderDto.notes,
    });

    const order = await this.orderModel.create({
      storeId: store._id,
      customerId: customer._id,
      orderCode,
      customerSnapshot: {
        name: createOrderDto.customer.name,
        phone: normalizedPhone,
      },
      deliveryAddress: createOrderDto.deliveryAddress,
      itemsSnapshot,
      notes: createOrderDto.notes ?? '',
      subtotalCents,
      deliveryFeeCents,
      totalCents,
      status: OrderStatus.PENDING_WHATSAPP_CONFIRMATION,
      source: 'pwa',
      whatsappMessage,
    });

    await this.customersService.registerOrder(customer._id);

    return {
      orderId: order.id,
      orderCode: order.orderCode,
      status: order.status,
      subtotalCents: order.subtotalCents,
      deliveryFeeCents: order.deliveryFeeCents,
      totalCents: order.totalCents,
      whatsappUrl: buildWhatsappUrl(settings.whatsappNumber, whatsappMessage),
      whatsappMessage,
    };
  }

  async listAdmin(storeId: string) {
    const items = await this.orderModel
      .find({ storeId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return {
      items: items.map((item) => ({
        id: item._id,
        orderCode: item.orderCode,
        customerName: item.customerSnapshot.name,
        status: item.status,
        totalCents: item.totalCents,
        createdAt: item.createdAt,
      })),
      total: items.length,
    };
  }

  async findAdminById(storeId: string, orderId: string) {
    const order = await this.orderModel
      .findOne({ _id: orderId, storeId })
      .lean()
      .exec();

    if (!order) {
      throw new NotFoundException('Pedido nao encontrado');
    }

    return order;
  }

  async updateStatus(
    storeId: string,
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.orderModel.findOne({
      _id: orderId,
      storeId,
    });

    if (!order) {
      throw new NotFoundException('Pedido nao encontrado');
    }

    order.status = updateOrderStatusDto.status;
    await order.save();

    return {
      id: order.id,
      status: order.status,
    };
  }

  private async generateOrderCode(storeId: Types.ObjectId) {
    const count = await this.orderModel.countDocuments({ storeId });
    return `HF-${count + 1001}`;
  }
}

