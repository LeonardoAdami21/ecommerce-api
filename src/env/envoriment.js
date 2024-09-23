import dotenv from 'dotenv';

dotenv.config();

export const appPort = process.env.APP_PORT || 3000;