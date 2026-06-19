import { IsOptional, IsString, Length } from 'class-validator';

export class AddressDto {
  @IsString()
  street!: string;

  @IsString()
  number!: string;

  @IsString()
  neighborhood!: string;

  @IsString()
  city!: string;

  @IsString()
  @Length(2, 2)
  state!: string;

  @IsString()
  zipCode!: string;

  @IsOptional()
  @IsString()
  complement?: string;
}

