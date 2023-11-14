import { User } from './user.interface';

export interface TokenResponse {
  user: User;
  token: string;
}
