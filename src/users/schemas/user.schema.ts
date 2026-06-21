import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Store } from '../../stores/schemas/store.schema';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
}

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Store.name, required: true })
  storeId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ required: true, enum: Object.values(UserRole), default: UserRole.ADMIN })
  role!: UserRole;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ storeId: 1, email: 1 }, { unique: true });
