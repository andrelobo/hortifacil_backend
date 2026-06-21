import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Novo nome comercial do produto',
    example: 'Alface americana premium',
    maxLength: 140,
  })
  @IsOptional()
  @IsString()
  @MaxLength(140)
  name?: string;

  @ApiPropertyOptional({
    description: 'Nova descricao do produto',
    example: 'Folha crocante selecionada no dia',
    maxLength: 400,
  })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @ApiPropertyOptional({
    description: 'Nova unidade de venda',
    example: 'kg',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unitLabel?: string;

  @ApiPropertyOptional({
    description: 'Novo preco base em centavos',
    example: 1499,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  priceCents?: number;

  @ApiPropertyOptional({
    description: 'Novo preco promocional em centavos',
    example: 1199,
    minimum: 0,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  promotionalPriceCents?: number | null;

  @ApiPropertyOptional({
    description: 'Novo ID de categoria ou null para desvincular',
    example: '665f3aa22d7d2c4e9a1c1234',
    nullable: true,
  })
  @IsOptional()
  @IsMongoId()
  categoryId?: string | null;

  @ApiPropertyOptional({
    description: 'Nova URL da imagem principal',
    example: 'https://cdn.hortifacil.com/produtos/alface-americana.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Atualiza a disponibilidade do produto',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    description: 'Atualiza o destaque do produto no catalogo',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
