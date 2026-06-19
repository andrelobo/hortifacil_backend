import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Store, StoreDocument } from './schemas/store.schema';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name)
    private readonly storeModel: Model<StoreDocument>,
  ) {}

  findById(id: string | Types.ObjectId) {
    return this.storeModel.findById(id).exec();
  }

  findDefaultStore() {
    return this.storeModel.findOne({ isActive: true }).sort({ createdAt: 1 }).exec();
  }
}

