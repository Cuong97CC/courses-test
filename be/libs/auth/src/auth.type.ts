import { User } from '@app/users';
import { Request } from 'express';
export interface IRequestWithAuth extends Request {
  userId: string;
  user: User;
}
