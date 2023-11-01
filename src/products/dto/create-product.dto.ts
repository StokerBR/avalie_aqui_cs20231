import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty({
    description: 'Nome do Produto',
    type: 'string',
    example: 'RTX 4060 Ti',
    minLength: 3,
    maxLength: 150,
    required: true,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty({
    description: 'Categoria do Produto',
    type: 'string',
    example: 'placa-de-video',
    minLength: 3,
    maxLength: 150,
    required: true,
  })
  category: string;

  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'Url da imagem do Produto',
    type: 'string',
    example:
      'https://files.tecnoblog.net/wp-content/uploads/2023/05/geforce-rtx-4060-ti-back-1060x795.jpg',
    maxLength: 255,
  })
  image_url: string;
}
