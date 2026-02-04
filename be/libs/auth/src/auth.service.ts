/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from './auth.config';
import type { ConfigType } from '@nestjs/config';
import { readFileSync } from 'fs';

export interface JwtPayload {
  userId: string;
}

@Injectable()
export class AuthService {
  private readonly accessJwtPrivateKey: string;
  private readonly accessJwtPublicKey: string;
  private readonly accessJwtExpirationInSec: number;
  private readonly refreshJwtPrivateKey: string;
  private readonly refreshJwtPublicKey: string;
  private readonly refreshJwtExpirationInSec: number;
  constructor(
    private readonly jwtService: JwtService,
    @Inject(AuthConfig.KEY)
    private readonly authConfig: ConfigType<typeof AuthConfig>,
  ) {
    this.accessJwtPrivateKey = readFileSync(
      this.authConfig.accessJwtPrivateKeyPath,
      'utf-8',
    );
    this.accessJwtPublicKey = readFileSync(
      this.authConfig.accessJwtPublicKeyPath,
      'utf-8',
    );
    this.accessJwtExpirationInSec = this.authConfig.accessJwtExpirationInSec;
    this.refreshJwtPrivateKey = readFileSync(
      this.authConfig.refreshJwtPrivateKeyPath,
      'utf-8',
    );
    this.refreshJwtPublicKey = readFileSync(
      this.authConfig.refreshJwtPublicKeyPath,
      'utf-8',
    );
    this.refreshJwtExpirationInSec = this.authConfig.refreshJwtExpirationInSec;
  }

  async generateAccessToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      privateKey: this.accessJwtPrivateKey,
      expiresIn: this.accessJwtExpirationInSec,
    });
    return {
      accessToken,
      expiresInSec: this.accessJwtExpirationInSec,
    };
  }

  async generateRefreshToken(payload: JwtPayload) {
    const refreshToken = this.jwtService.sign(payload, {
      privateKey: this.refreshJwtPrivateKey,
      expiresIn: this.refreshJwtExpirationInSec,
    });
    return {
      refreshToken,
      expiresInSec: this.refreshJwtExpirationInSec,
    };
  }

  async verifyAccessToken(token: string) {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        publicKey: this.accessJwtPublicKey,
      });
    } catch {
      throw new UnauthorizedException('TOKEN.INVALID');
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        publicKey: this.refreshJwtPublicKey,
      });
    } catch {
      throw new UnauthorizedException('TOKEN.INVALID');
    }
  }
}
