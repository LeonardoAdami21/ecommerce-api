import bcrypt from "bcrypt";
import { jwtSecret } from "../env/envoriment.js";
import jwt from "jsonwebtoken";
import { adminRepository } from "./mongo/admin.repository.js";

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
    const admin = await adminRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    return admin;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const login = async (email, password) => {
  try {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) {
      throw new Error("Admin not found");
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    const payload = {
      _id: admin._id,
      userType: admin.userType,
    };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "1h",
    });
    return { access_token: token };
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const findByEmail = async (email) => {
  try {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) {
      throw new Error("Admin not found");
    }
    return admin;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

export const adminService = { create, login, findByEmail };
