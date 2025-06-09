import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { Request } from 'express';

dotenv.config();

export interface JwtPayload {
  username: string;
  email: string;
  _id: string;
  iat?: number;
  exp?: number;
}

export const signToken = (username: string, email: string, _id: string): string => {
  const payload = { username, email, _id };
  const secret = process.env.JWT_SECRET_KEY || 'secret';
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = ({ req }: { req: AuthRequest }): AuthRequest => {
  let token = req.headers.authorization || '';
  if (token.startsWith('Bearer ')) {
    token = token.slice(7).trimLeft();
  }

  if (!token) {
    return req;
  }

  try {
    const secret = process.env.JWT_SECRET_KEY || 'secret';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
  } catch (err) {
    console.log('Invalid token', err);
  }

  return req;
};
