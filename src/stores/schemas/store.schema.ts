import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StoreDocument = HydratedDocument<Store>;

@Schema({
  collection: 'stores',
  timestamps: true,
})
export class Store {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true, lowercase: true })
  slug!: string;

  @Prop({ default: true })
  isActive!: boolean;
}

export const StoreSchema = SchemaFactory.createForClass(Store);

StoreSchema.index({ slug: 1 }, { unique: true });

