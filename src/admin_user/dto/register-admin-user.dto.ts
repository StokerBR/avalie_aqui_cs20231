import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterAdminUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty({
    description: 'Nome do Admin',
    type: 'string',
    example: 'João Borges',
    minLength: 3,
    maxLength: 150,
    required: true,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  @ApiProperty({
    description: 'Email do Admin',
    type: 'string',
    example: 'joaoborges@gmail.com',
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
    description: 'Senha do Admin',
    type: 'string',
    example: 'senha123',
    minLength: 6,
    maxLength: 150,
    required: true,
  })
  password: string;
}
