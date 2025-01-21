import * as dotenv from "dotenv";

dotenv.config();

export const appPort = process.env.APP_PORT || 3000;

export const mongoUri = process.env.MONGODB_URI;

export const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
export const upstashRedisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export const nodeEnv = process.env.NODE_ENV;

export const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
export const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
export const cloudinaryApiKeySecret = process.env.CLOUDINARY_API_KEY_SECRET;