import { User } from '@app/users';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class TokenPairDto {
  @ApiProperty({
    description: 'JWT access token',
    name: 'access_token',
  })
  @Expose({ name: 'access_token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token', name: 'refresh_token' })
  @Expose({ name: 'refresh_token' })
  refreshToken: string;

  @ApiProperty({
    name: 'expires_in_sec',
    description: 'Access token expiration in seconds',
    example: 900,
  })
  @Expose({ name: 'expires_in_sec' })
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
    name: 'access_token',
  })
  @Expose({ name: 'access_token' })
  accessToken: string;

  @ApiProperty({
    name: 'expires_in_sec',
    description: 'Access token expiration in seconds',
    example: 900,
  })
  @Expose({ name: 'expires_in_sec' })
  expiresInSec: number;
}
