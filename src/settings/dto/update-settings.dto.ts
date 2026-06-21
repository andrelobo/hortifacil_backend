import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { AddressDto } from '../../common/dto/address.dto';

export class UpdateSettingsDto {
  @ApiProperty({
    description: 'Nome exibido da loja',
    example: 'HortiFacil Demo',
  })
  @IsString()
  storeName!: string;

  @ApiProperty({
    description: 'WhatsApp principal da loja',
    example: '5592999999999',
  })
  @IsString()
  whatsappNumber!: string;

  @ApiPropertyOptional({
    description: 'URL do logo da loja',
    example: 'https://cdn.hortifacil.com/logo.png',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Cor principal da identidade visual',
    example: '#2F855A',
  })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional({
    description: 'Taxa de entrega em centavos',
    example: 500,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  deliveryFeeCents?: number;

  @ApiPropertyOptional({
    description: 'Pedido minimo em centavos',
    example: 3000,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minimumOrderCents?: number;

  @ApiPropertyOptional({
    description: 'Horario comercial exibido ao cliente',
    example: 'Seg a Sab 07:00-18:00',
  })
  @IsOptional()
  @IsString()
  businessHours?: string;

  @ApiProperty({
    description: 'Endereco principal da loja',
    type: AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;
}
