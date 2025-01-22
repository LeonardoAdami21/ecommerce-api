import redisClient from "../config/redis.config.js";
import { refreshTokenSecret } from "../env/envoriment.js";
import User from "../users/model/user.model.js";
import argon from "argon2";
import jwt from "jsonwebtoken";

const register = async (data) => {
  try {
    const { name, email, password, role } = data;
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }
    const hashedPassword = await argon.hash(password);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: role || "user",
    });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const refreshToken = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const refreshToken = jwt.sign({ userId }, refreshTokenSecret, {
      expiresIn: "7d",
    });
    await redisClient.set(
      `refresh_token:${userId}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60,
    );
    return refreshToken;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserProfile = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const AuthService = { register, refreshToken, findUserByEmail, getUserProfile };
