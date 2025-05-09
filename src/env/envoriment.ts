import * as dotenv from 'dotenv';

dotenv.config();
export const appPort = process.env.APP_PORT || 3000;

export const nodeEnv = process.env.NODE_ENV || 'development';

export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
