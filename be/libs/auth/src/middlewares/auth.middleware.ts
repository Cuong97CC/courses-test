import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { IRequestWithAuth } from '../auth.type';
import { AuthService } from '../auth.service';
import { UsersService } from '@app/users';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: IRequestWithAuth, res: Response, next: () => void) {
    const authorization = req.header('Authorization') || '';
    const accessToken = authorization.split(' ')[1];

    if (accessToken) {
      const decoded = await this.authService.verifyAccessToken(accessToken);

      const { userId } = decoded;

      const user = await this.usersService.findById(userId);

      if (!user) {
        throw new UnauthorizedException('TOKEN.INVALID');
      }

      req.userId = userId;
      req.user = user;
    } else {
      throw new UnauthorizedException('TOKEN.INVALID');
    }

    next();
  }
}
