import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdatePromotionDto {
  @ApiPropertyOptional({
    description: 'Novo titulo da promocao',
    example: 'Oferta relampago de domingo',
    maxLength: 140,
  })
  @IsOptional()
  @IsString()
  @MaxLength(140)
  title?: string;

  @ApiPropertyOptional({
    description: 'Nova descricao da promocao',
    example: 'Descontos atualizados para legumes e frutas',
    maxLength: 400,
  })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @ApiPropertyOptional({
    description: 'Novo banner da promocao',
    example: 'https://cdn.hortifacil.com/banners/domingo.png',
  })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional({
    description: 'Lista atualizada de produtos vinculados',
    example: ['665f3aa22d7d2c4e9a1c1234'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  productIds?: string[];

  @ApiPropertyOptional({
    description: 'Lista atualizada de categorias vinculadas',
    example: ['665f3aa22d7d2c4e9a1c5678'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({
    description: 'Nova data e hora inicial em ISO 8601',
    example: '2026-06-20T08:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional({
    description: 'Nova data e hora final em ISO 8601',
    example: '2026-06-21T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @ApiPropertyOptional({
    description: 'Ativa ou desativa a promocao',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
