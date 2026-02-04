import { registerAs } from '@nestjs/config';

export const AuthConfig = registerAs('auth', () => ({
  accessJwtPrivateKeyPath: process.env.ACCESS_JWT_PRIVATE_KEY_PATH!,
  accessJwtPublicKeyPath: process.env.ACCESS_JWT_PUBLIC_KEY_PATH!,
  accessJwtExpirationInSec: Number(process.env.ACCESS_JWT_EXPIRATION_IN_SEC!),
  refreshJwtPrivateKeyPath: process.env.REFRESH_JWT_PRIVATE_KEY_PATH!,
  refreshJwtPublicKeyPath: process.env.REFRESH_JWT_PUBLIC_KEY_PATH!,
  refreshJwtExpirationInSec: Number(process.env.REFRESH_JWT_EXPIRATION_IN_SEC!),
}));
