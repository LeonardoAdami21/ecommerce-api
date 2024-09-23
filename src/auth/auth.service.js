import bcrypt from "bcrypt";
import { authRepository } from "./mongo/auth.repository.js";
import { jwtSecret } from "../env/envoriment.js";
const create = async (data) => {
  try {
    const { name, email, password } = data;
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      throw new Error("Failed to hash password");
    }
    const user = await authRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const login = async (email, password) => {
  try {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    const payload = {
      _id: user._id,
      userType: user.userType,
    };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "1h",
    });
    return { access_token: token };
  } catch (error) {
    throw new Error(error);
  }
};

const findByEmail = async (email) => {
  try {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

export const authService = { create, login, findByEmail };
