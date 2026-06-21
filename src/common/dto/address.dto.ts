import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class AddressDto {
  @ApiProperty({
    description: 'Nome da rua ou avenida',
    example: 'Rua das Flores',
  })
  @IsString()
  street!: string;

  @ApiProperty({
    description: 'Numero do endereco',
    example: '123',
  })
  @IsString()
  number!: string;

  @ApiProperty({
    description: 'Bairro do endereco',
    example: 'Centro',
  })
  @IsString()
  neighborhood!: string;

  @ApiProperty({
    description: 'Cidade do endereco',
    example: 'Manaus',
  })
  @IsString()
  city!: string;

  @ApiProperty({
    description: 'Sigla do estado com 2 caracteres',
    example: 'AM',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @Length(2, 2)
  state!: string;

  @ApiProperty({
    description: 'CEP somente com numeros ou formatado',
    example: '69000000',
  })
  @IsString()
  zipCode!: string;

  @ApiPropertyOptional({
    description: 'Complemento do endereco',
    example: 'Casa amarela ao lado da padaria',
  })
  @IsOptional()
  @IsString()
  complement?: string;
}
