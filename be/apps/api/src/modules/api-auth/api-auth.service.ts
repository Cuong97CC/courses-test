import { AuthService } from '@app/auth';
import { User, UsersService } from '@app/users';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginResponseDto, RefreshTokenResponseDto } from './dto/response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ApiAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('CREDENTIALS.INVALID');
    }
    const isPasswordValid = await this.usersService.checkPassword(
      password,
      user,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('CREDENTIALS.INVALID');
    }
    const { accessToken, expiresInSec } =
      await this.authService.generateAccessToken({
        userId: user.id,
      });
    const { refreshToken } = await this.authService.generateRefreshToken({
      userId: user.id,
    });
    return plainToInstance(
      LoginResponseDto,
      {
        user,
        accessToken,
        refreshToken,
        expiresInSec,
      },
      { ignoreDecorators: true },
    );
  }

  async refresh(refreshToken: string) {
    const { userId } = await this.authService.verifyRefreshToken(refreshToken);
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('CREDENTIALS.INVALID');
    }
    const { accessToken, expiresInSec } =
      await this.authService.generateAccessToken({
        userId: user.id,
      });
    return plainToInstance(
      RefreshTokenResponseDto,
      {
        accessToken,
        expiresInSec,
      },
      { ignoreDecorators: true },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logout(user: User) {
    // TODO: implement logout
  }
}
