import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { AddressDto } from '../../common/dto/address.dto';

export class UpdateCustomerDto {
  @ApiPropertyOptional({
    description: 'Novo nome do cliente',
    example: 'Andre Lobo',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Observacoes internas sobre o cliente',
    example: 'Prefere receber pela manha',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Novo endereco padrao do cliente',
    type: AddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  defaultAddress?: AddressDto;
}
