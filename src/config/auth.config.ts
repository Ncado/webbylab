import { registerAs } from '@nestjs/config';
import { Env } from '../utils/validate-env';

export const authConfig = registerAs('authConfig', () => ({
  secret: Env.string('JWT_SECRET'),
  signOptions: { expiresIn: '365d' },
}));
//Env.string('JWT_SECRET')
