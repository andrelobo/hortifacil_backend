import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Store } from '../../stores/schemas/store.schema';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema({ _id: false })
export class SettingsAddress {
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

const SettingsAddressSchema = SchemaFactory.createForClass(SettingsAddress);

@Schema({
  collection: 'settings',
  timestamps: true,
})
export class Settings {
  @Prop({ type: Types.ObjectId, ref: Store.name, required: true, unique: true })
  storeId!: Types.ObjectId;

  @Prop({ required: true })
  storeName!: string;

  @Prop({ required: true })
  whatsappNumber!: string;

  @Prop()
  logoUrl?: string;

  @Prop({ default: '#2F855A' })
  primaryColor!: string;

  @Prop({ default: 0 })
  deliveryFeeCents!: number;

  @Prop({ default: 0 })
  minimumOrderCents!: number;

  @Prop({ default: '' })
  businessHours!: string;

  @Prop({ type: SettingsAddressSchema, required: true })
  address!: SettingsAddress;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);

