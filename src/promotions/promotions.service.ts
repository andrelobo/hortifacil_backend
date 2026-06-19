import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StoresService } from '../stores/stores.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name)
    private readonly promotionModel: Model<PromotionDocument>,
    private readonly storesService: StoresService,
  ) {}

  async create(storeId: string, createPromotionDto: CreatePromotionDto) {
    this.validatePeriod(createPromotionDto.startsAt, createPromotionDto.endsAt);

    return this.promotionModel.create({
      storeId,
      title: createPromotionDto.title,
      description: createPromotionDto.description,
      bannerUrl: createPromotionDto.bannerUrl,
      productIds: (createPromotionDto.productIds ?? []).map(
        (id) => new Types.ObjectId(id),
      ),
      categoryIds: (createPromotionDto.categoryIds ?? []).map(
        (id) => new Types.ObjectId(id),
      ),
      startsAt: new Date(createPromotionDto.startsAt),
      endsAt: new Date(createPromotionDto.endsAt),
      isActive: createPromotionDto.isActive ?? true,
    });
  }

  async listAdmin(storeId: string) {
    const items = await this.promotionModel
      .find({ storeId })
      .sort({ startsAt: -1 })
      .lean()
      .exec();

    return {
      items,
      total: items.length,
    };
  }

  async listPublic() {
    const store = await this.storesService.findDefaultStore();

    if (!store) {
      throw new NotFoundException('Nenhuma loja ativa encontrada');
    }

    const now = new Date();

    return {
      items: await this.promotionModel
        .find({
          storeId: store._id,
          isActive: true,
          startsAt: { $lte: now },
          endsAt: { $gte: now },
        })
        .sort({ startsAt: -1 })
        .lean()
        .exec(),
    };
  }

  async update(
    storeId: string,
    promotionId: string,
    updatePromotionDto: UpdatePromotionDto,
  ) {
    const promotion = await this.promotionModel.findOne({
      _id: promotionId,
      storeId,
    });

    if (!promotion) {
      throw new NotFoundException('Promocao nao encontrada');
    }

    const nextStartsAt = updatePromotionDto.startsAt ?? promotion.startsAt.toISOString();
    const nextEndsAt = updatePromotionDto.endsAt ?? promotion.endsAt.toISOString();
    this.validatePeriod(nextStartsAt, nextEndsAt);

    if (updatePromotionDto.title !== undefined) {
      promotion.title = updatePromotionDto.title;
    }

    if (updatePromotionDto.description !== undefined) {
      promotion.description = updatePromotionDto.description;
    }

    if (updatePromotionDto.bannerUrl !== undefined) {
      promotion.bannerUrl = updatePromotionDto.bannerUrl;
    }

    if (updatePromotionDto.productIds !== undefined) {
      promotion.productIds = updatePromotionDto.productIds.map(
        (id) => new Types.ObjectId(id),
      );
    }

    if (updatePromotionDto.categoryIds !== undefined) {
      promotion.categoryIds = updatePromotionDto.categoryIds.map(
        (id) => new Types.ObjectId(id),
      );
    }

    if (updatePromotionDto.startsAt !== undefined) {
      promotion.startsAt = new Date(updatePromotionDto.startsAt);
    }

    if (updatePromotionDto.endsAt !== undefined) {
      promotion.endsAt = new Date(updatePromotionDto.endsAt);
    }

    if (updatePromotionDto.isActive !== undefined) {
      promotion.isActive = updatePromotionDto.isActive;
    }

    await promotion.save();

    return promotion;
  }

  private validatePeriod(startsAt: string, endsAt: string) {
    if (new Date(endsAt) < new Date(startsAt)) {
      throw new BadRequestException(
        'Data final nao pode ser anterior a data inicial',
      );
    }
  }
}

