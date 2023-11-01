import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Token de refresh',
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c3VhcmlvQGF2YWxpZWFxdWkuY29tIiwibmFtZSI6IlVzdcOhcmlvIEF2YWxpZSBBcXVpIiwiaWF0IjoxNjg2NjA5NjEwLCJleHAiOjE2ODcyMTQ0MTB9.S8pVu423zOCUDuMwprsx2_UR3HhrZNGPYI2hMuM7IfE',
    required: true,
  })
  refresh_token: string;
}
