import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { AddressDto } from '../../common/dto/address.dto';

export class UpdateSettingsDto {
  @IsString()
  storeName!: string;

  @IsString()
  whatsappNumber!: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  deliveryFeeCents?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minimumOrderCents?: number;

  @IsOptional()
  @IsString()
  businessHours?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;
}

