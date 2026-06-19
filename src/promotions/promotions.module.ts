import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoresModule } from '../stores/stores.module';
import { Promotion, PromotionSchema } from './schemas/promotion.schema';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';

@Module({
  imports: [
    StoresModule,
    MongooseModule.forFeature([{ name: Promotion.name, schema: PromotionSchema }]),
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService],
})
export class PromotionsModule {}

