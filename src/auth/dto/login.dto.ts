import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail do usuario administrativo da loja',
    example: 'admin@hortifacil.local',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Senha do usuario administrativo',
    example: 'senhaSegura123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
