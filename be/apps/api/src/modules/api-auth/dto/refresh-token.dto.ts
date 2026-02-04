import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    name: 'refresh_token',
  })
  @Expose({ name: 'refresh_token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
