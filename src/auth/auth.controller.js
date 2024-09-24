import { authService } from "./auth.service.js";
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

    const user = await authService.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json(user);
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
    const user = await authService.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
   
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const payload = {
      _id: user._id,
      userType: user.userType,
    };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    return res.status(201).json({ access_token: token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const authController = { register, login };
