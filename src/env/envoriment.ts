import * as dotenv from 'dotenv';

dotenv.config();

export const environment = {
  MONGO_URL: process.env.MONGO_URL,
  APP_PORT: process.env.APP_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,
  NODEMAILER_PORT: process.env.NODEMAILER_PORT,
};
