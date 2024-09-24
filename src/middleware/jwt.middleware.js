import jwt from "jsonwebtoken";
import { jwtSecret } from "../env/envoriment.js";

const jwtMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    req.userType = decoded.userType || "user" || "admin";
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.userType !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
};

const userMiddleware = (req, res, next) => {
  if (req.userType !== "user") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
};

export default { jwtMiddleware, adminMiddleware, userMiddleware };
