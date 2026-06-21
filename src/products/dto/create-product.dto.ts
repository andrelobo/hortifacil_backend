import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Nome comercial do produto',
    example: 'Alface crespa',
    maxLength: 140,
  })
  @IsString()
  @MaxLength(140)
  name!: string;

  @ApiPropertyOptional({
    description: 'Descricao curta do produto',
    example: 'Unidade fresca selecionada no dia',
    maxLength: 400,
  })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @ApiProperty({
    description: 'Unidade de venda exibida ao cliente',
    example: 'un',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  unitLabel!: string;

  @ApiProperty({
    description: 'Preco base em centavos',
    example: 1299,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  priceCents!: number;

  @ApiPropertyOptional({
    description: 'Preco promocional em centavos',
    example: 999,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  promotionalPriceCents?: number;

  @ApiPropertyOptional({
    description: 'ID da categoria vinculada ao produto',
    example: '665f3aa22d7d2c4e9a1c1234',
  })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'URL da imagem principal do produto',
    example: 'https://cdn.hortifacil.com/produtos/alface-crespa.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Indica se o produto esta disponivel para venda',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    description: 'Destaca o produto no catalogo',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
