import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Store } from '../../stores/schemas/store.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  collection: 'categories',
  timestamps: true,
})
export class Category {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Store.name, required: true })
  storeId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true, lowercase: true })
  slug!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ default: 0 })
  sortOrder!: number;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: Date, default: null })
  archivedAt!: Date | null;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ storeId: 1, slug: 1 }, { unique: true });
