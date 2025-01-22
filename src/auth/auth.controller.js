import { AuthService } from "./auth.service.js";
import redisClient from "../config/redis.config.js";
import { nodeEnv } from "../env/envoriment.js";
import { accessTokenSecret, refreshTokenSecret } from "../env/envoriment.js";
import User from "../users/model/user.model.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, accessTokenSecret, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign({ userId }, refreshTokenSecret, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  try {
    await redisClient.set(
      `refresh_token:${userId}`,
      `${refreshToken}`,
      "EX",
      7 * 24 * 60 * 60,
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

const setCookie = (res, accessTokenSecret, refreshTokenSecret) => {
  res.cookie("accessToken", accessTokenSecret, {
    httpOnly: true,
    secure: nodeEnv === "production",
    sameSite: "strict",
    max: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshTokenSecret, {
    httpOnly: true,
    secure: nodeEnv === "production",
    sameSite: "strict",
    max: 7 * 24 * 60 * 60 * 1000,
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await AuthService.register({
      name,
      email,
      password,
    });
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookie(res, accessToken, refreshToken);
    return res.status(201).json({
      data: user,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const { accessToken, refreshToken } = generateToken(user._id);
    storeRefreshToken(user._id, refreshToken);
    return res.status(200).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      message: "User login successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decodedRefreshToken = jwt.verify(refreshToken, refreshTokenSecret);
      await redisClient.del(`refresh_token:${decodedRefreshToken.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "User logout successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }
    let decodedRefreshToken;
    try {
      decodedRefreshToken = jwt.verify(refreshToken, refreshTokenSecret);
    } catch (error) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const storedRefreshToken = await redisClient.get(
      `refresh_token:${decodedRefreshToken.userId}`,
    );
    if (storedRefreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const accessToken = jwt.sign(
      { userId: decodedRefreshToken.userId },
      accessTokenSecret,
      { expiresIn: "15m" },
    );
    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findUserProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const AuthController = {
  register,
  login,
  logout,
  refreshToken,
  findUserProfile,
};
