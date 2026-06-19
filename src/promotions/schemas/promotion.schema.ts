import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';
import { Product } from '../../products/schemas/product.schema';
import { Store } from '../../stores/schemas/store.schema';

export type PromotionDocument = HydratedDocument<Promotion>;

@Schema({
  collection: 'promotions',
  timestamps: true,
})
export class Promotion {
  @Prop({ type: Types.ObjectId, ref: Store.name, required: true })
  storeId!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop()
  bannerUrl?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }], default: [] })
  productIds!: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Category.name }], default: [] })
  categoryIds!: Types.ObjectId[];

  @Prop({ required: true })
  startsAt!: Date;

  @Prop({ required: true })
  endsAt!: Date;

  @Prop({ default: true })
  isActive!: boolean;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);

