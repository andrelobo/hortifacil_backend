import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Customer } from '../../customers/schemas/customer.schema';
import { Product } from '../../products/schemas/product.schema';
import { Store } from '../../stores/schemas/store.schema';

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
  PENDING_WHATSAPP_CONFIRMATION = 'pending_whatsapp_confirmation',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ _id: false })
export class OrderCustomerSnapshot {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  phone!: string;
}

const OrderCustomerSnapshotSchema =
  SchemaFactory.createForClass(OrderCustomerSnapshot);

@Schema({ _id: false })
export class OrderAddress {
  @Prop({ required: true })
  street!: string;

  @Prop({ required: true })
  number!: string;

  @Prop({ required: true })
  neighborhood!: string;

  @Prop({ required: true })
  city!: string;

  @Prop({ required: true })
  state!: string;

  @Prop({ required: true })
  zipCode!: string;

  @Prop()
  complement?: string;
}

const OrderAddressSchema = SchemaFactory.createForClass(OrderAddress);

@Schema({ _id: false })
export class OrderItemSnapshot {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  unitLabel!: string;

  @Prop({ required: true })
  unitPriceCents!: number;

  @Prop({ required: true })
  quantity!: number;

  @Prop({ required: true })
  lineTotalCents!: number;
}

const OrderItemSnapshotSchema = SchemaFactory.createForClass(OrderItemSnapshot);

@Schema({
  collection: 'orders',
  timestamps: true,
})
export class Order {
  @Prop({ type: Types.ObjectId, ref: Store.name, required: true })
  storeId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Customer.name, required: true })
  customerId!: Types.ObjectId;

  @Prop({ required: true })
  orderCode!: string;

  @Prop({ type: OrderCustomerSnapshotSchema, required: true })
  customerSnapshot!: OrderCustomerSnapshot;

  @Prop({ type: OrderAddressSchema, required: true })
  deliveryAddress!: OrderAddress;

  @Prop({ type: [OrderItemSnapshotSchema], required: true })
  itemsSnapshot!: OrderItemSnapshot[];

  @Prop({ default: '' })
  notes!: string;

  @Prop({ required: true })
  subtotalCents!: number;

  @Prop({ required: true, default: 0 })
  deliveryFeeCents!: number;

  @Prop({ required: true })
  totalCents!: number;

  @Prop({
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING_WHATSAPP_CONFIRMATION,
  })
  status!: OrderStatus;

  @Prop({ required: true, default: 'pwa' })
  source!: string;

  @Prop({ required: true })
  whatsappMessage!: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ storeId: 1, orderCode: 1 }, { unique: true });
