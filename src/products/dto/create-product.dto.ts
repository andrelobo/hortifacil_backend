import {
  IsBoolean,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(140)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @IsString()
  @MaxLength(20)
  unitLabel!: string;

  @IsInt()
  @Min(0)
  priceCents!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  promotionalPriceCents?: number;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

