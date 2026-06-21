import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({
    description: 'Titulo principal da promocao',
    example: 'Oferta de fim de semana',
    maxLength: 140,
  })
  @IsString()
  @MaxLength(140)
  title!: string;

  @ApiPropertyOptional({
    description: 'Descricao curta da promocao',
    example: 'Descontos especiais em folhas e legumes',
    maxLength: 400,
  })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @ApiPropertyOptional({
    description: 'URL do banner promocional',
    example: 'https://cdn.hortifacil.com/banners/fds.png',
  })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional({
    description: 'Lista de IDs de produtos vinculados a promocao',
    example: ['665f3aa22d7d2c4e9a1c1234'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  productIds?: string[];

  @ApiPropertyOptional({
    description: 'Lista de IDs de categorias vinculadas a promocao',
    example: ['665f3aa22d7d2c4e9a1c5678'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categoryIds?: string[];

  @ApiProperty({
    description: 'Data e hora de inicio da promocao em ISO 8601',
    example: '2026-06-20T08:00:00.000Z',
  })
  @IsDateString()
  startsAt!: string;

  @ApiProperty({
    description: 'Data e hora final da promocao em ISO 8601',
    example: '2026-06-21T23:59:59.000Z',
  })
  @IsDateString()
  endsAt!: string;

  @ApiPropertyOptional({
    description: 'Indica se a promocao esta ativa',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
