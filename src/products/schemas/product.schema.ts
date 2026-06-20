import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';
import { Store } from '../../stores/schemas/store.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  collection: 'products',
  timestamps: true,
})
export class Product {
  @Prop({ type: Types.ObjectId, ref: Store.name, required: true })
  storeId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Category.name, default: null })
  categoryId!: Types.ObjectId | null;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true, lowercase: true })
  slug!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, trim: true })
  unitLabel!: string;

  @Prop({ required: true, min: 0 })
  priceCents!: number;

  @Prop({ type: Number, default: null, min: 0 })
  promotionalPriceCents!: number | null;

  @Prop()
  imageUrl?: string;

  @Prop({ default: true })
  isAvailable!: boolean;

  @Prop({ default: false })
  isFeatured!: boolean;

  @Prop({ type: Date, default: null })
  archivedAt!: Date | null;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ storeId: 1, slug: 1 }, { unique: true });
