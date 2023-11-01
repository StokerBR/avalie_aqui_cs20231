import { ApiProperty } from '@nestjs/swagger';
import { IsCPF } from 'brazilian-class-validator';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty({
    description: 'Nome do Usuário',
    type: 'string',
    example: 'João da Silva',
    minLength: 3,
    maxLength: 150,
    required: true,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsCPF()
  @ApiProperty({
    description: 'CPF do Usuário',
    type: 'string',
    example: '69796737000',
    format: '99999999999 ou 999.999.999-99',
    required: true,
  })
  cpf: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  @ApiProperty({
    description: 'Email do Usuário',
    type: 'string',
    example: 'joaodasilva@gmail.com',
    format: 'email',
    maxLength: 150,
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(150)
  @ApiProperty({
    description: 'Senha do Usuário',
    type: 'string',
    example: 'senha123',
    minLength: 6,
    maxLength: 150,
    required: true,
  })
  password: string;
}
