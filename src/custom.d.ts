import { Request } from 'express';

declare module 'express' {
  interface Request {
    auth_user?: {
      sub: number;
      username: string;
      iat: number,
      exp: number
    };
  }
}