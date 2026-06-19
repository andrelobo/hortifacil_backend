import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddressDto } from '../common/dto/address.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, CustomerDocument } from './schemas/customer.schema';

interface CustomerOrderInput {
  name: string;
  phone: string;
}

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async upsertFromOrderInput(
    storeId: string | Types.ObjectId,
    customerInput: CustomerOrderInput,
    address: AddressDto,
  ) {
    const normalizedPhone = customerInput.phone.replace(/\D/g, '');

    const customer = await this.customerModel
      .findOneAndUpdate(
        { storeId, phone: normalizedPhone },
        {
          storeId,
          name: customerInput.name,
          phone: normalizedPhone,
          defaultAddress: address,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      )
      .exec();

    return customer;
  }

  async registerOrder(customerId: string | Types.ObjectId) {
    await this.customerModel.findByIdAndUpdate(customerId, {
      $inc: { orderCount: 1 },
      $set: { lastOrderAt: new Date() },
    });
  }

  async listAdmin(storeId: string) {
    const items = await this.customerModel
      .find({ storeId })
      .sort({ lastOrderAt: -1, createdAt: -1 })
      .lean()
      .exec();

    return {
      items,
      total: items.length,
    };
  }

  async findAdminById(storeId: string, customerId: string) {
    const customer = await this.customerModel
      .findOne({ _id: customerId, storeId })
      .lean()
      .exec();

    if (!customer) {
      throw new NotFoundException('Cliente nao encontrado');
    }

    return customer;
  }

  async update(storeId: string, customerId: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerModel.findOne({
      _id: customerId,
      storeId,
    });

    if (!customer) {
      throw new NotFoundException('Cliente nao encontrado');
    }

    if (updateCustomerDto.name !== undefined) {
      customer.name = updateCustomerDto.name;
    }

    if (updateCustomerDto.notes !== undefined) {
      customer.notes = updateCustomerDto.notes;
    }

    if (updateCustomerDto.defaultAddress !== undefined) {
      customer.defaultAddress = updateCustomerDto.defaultAddress;
    }

    await customer.save();

    return customer;
  }
}

