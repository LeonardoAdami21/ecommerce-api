import { adminService } from "./admin.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../env/envoriment.js";
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword) {
      return res.status(409).json({ error: "Failed to hash password" });
    }

    const admin = await adminService.create({
      name,
      email,
      password: hashedPassword,
      userType: "admin",
    });

    return res.status(201).json(admin);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const admin = await adminService.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const payload = {
      _id: admin._id,
      userType: admin.userType,
    };
    const token =  jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    return res.status(201).json({ access_token: token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const adminController = { register, login };
