import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '../../common/dto/address.dto';

class OrderCustomerDto {
  @ApiProperty({
    description: 'Nome do cliente que esta comprando',
    example: 'Andre Lobo',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Telefone ou WhatsApp do cliente',
    example: '92999990000',
  })
  @IsString()
  phone!: string;
}

class OrderItemDto {
  @ApiProperty({
    description: 'ID do produto selecionado',
    example: '665f3aa22d7d2c4e9a1c1234',
  })
  @IsString()
  productId!: string;

  @ApiProperty({
    description: 'Quantidade do item no pedido',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Dados de identificacao do cliente',
    type: OrderCustomerDto,
  })
  @ValidateNested()
  @Type(() => OrderCustomerDto)
  customer!: OrderCustomerDto;

  @ApiProperty({
    description: 'Endereco de entrega do pedido',
    type: AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  deliveryAddress!: AddressDto;

  @ApiProperty({
    description: 'Itens selecionados no carrinho',
    type: [OrderItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @ApiPropertyOptional({
    description: 'Observacoes livres do cliente',
    example: 'Entregar ate 18h e tocar interfone',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
