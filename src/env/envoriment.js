import dotenv from "dotenv";

dotenv.config();

export const appPort = process.env.APP_PORT || 3000;
export const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost:27017/ecommerce-api";

export const jwtSecret = process.env.JWT_SECRET || "secret";
export const clientId = process.env.GOOGLE_CLIENT_ID;
export const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
export const callbackUrl =
  process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback";
