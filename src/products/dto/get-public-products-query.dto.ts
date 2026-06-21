import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class GetPublicProductsQueryDto {
  @ApiPropertyOptional({
    description: 'Filtra produtos por categoria',
    example: '665f3aa22d7d2c4e9a1c1234',
  })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Retorna apenas produtos destacados',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Retorna apenas produtos com preco promocional',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  promotionOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Busca textual por nome do produto',
    example: 'alface',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
