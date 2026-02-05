import { User } from '@app/users';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class TokenPairDto {
  @ApiProperty({
    description: 'JWT access token',
  })
  @Expose()
  accessToken: string;

  @ApiProperty({ description: 'Refresh token' })
  @Expose()
  refreshToken: string;

  @ApiProperty({
    description: 'Access token expiration in seconds',
    example: 900,
  })
  @Expose()
  expiresInSec: number;
}

export class LoginResponseDto extends TokenPairDto {
  @ApiProperty({ type: User })
  @Expose()
  @Type(() => User)
  user: User;
}

export class RefreshTokenResponseDto {
  @ApiProperty({
    description: 'JWT access token',
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    description: 'Access token expiration in seconds',
    example: 900,
  })
  @Expose()
  expiresInSec: number;
}
