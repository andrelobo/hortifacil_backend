import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Store } from '../../stores/schemas/store.schema';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ _id: false })
export class CustomerAddress {
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

const CustomerAddressSchema = SchemaFactory.createForClass(CustomerAddress);

@Schema({
  collection: 'customers',
  timestamps: true,
})
export class Customer {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Store.name, required: true })
  storeId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ type: CustomerAddressSchema, required: true })
  defaultAddress!: CustomerAddress;

  @Prop({ default: '' })
  notes!: string;

  @Prop({ default: 0 })
  orderCount!: number;

  @Prop()
  lastOrderAt?: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.index({ storeId: 1, phone: 1 }, { unique: true });
