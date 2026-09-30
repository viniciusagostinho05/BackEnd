// auth.middleware.ts
import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { TypedRequest } from '../utils/typed-request';

export interface JwtPayload {
    contoCorrenteId: string;
    email: string;
    password: string;
    cognomeTitolare: string;
    nomeTitolare: string;
    dataApertura: string;
    IBAN: string;
    isVerified: boolean;
}

export interface AuthRequest<
  B = any,
  Q = Record<string, any>,
  P = Record<string, any>
> extends TypedRequest<B, Q, P> {
  user: JwtPayload;
}

export const authMiddleware: RequestHandler = (req, res, next) => {

  // console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'IMPOSTATO' : 'NON IMPOSTATO');
  // console.log('=== AUTH MIDDLEWARE ===');
  // console.log('Path:', req.path);
  // console.log('Method:', req.method);
  // console.log('TUTTI GLI HEADERS:', JSON.stringify(req.headers, null, 2));
  // console.log('Authorization:', req.headers.authorization);
  // console.log('authorization (minuscolo):', req.headers.authorization);
  // console.log('========================');

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Token mancante o formato errato');
    res.status(401).json({ message: 'Token mancante' });
    return;
  }

  const token = authHeader.split(' ')[1];
  console.log('Token estratto:', token);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log('Payload:', payload);
    (req as AuthRequest).user = payload;
    next();
  } catch (err) {
    console.error('Errore verify:', err);
    res.status(401).json({ message: 'Token non valido' });
    return;
  }
};