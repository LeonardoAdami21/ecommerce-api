import jwt from "jsonwebtoken";
import { accessTokenSecret } from "../env/envoriment.js";
import User from "../users/model/user.model.js";

const protectedRoutes = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const decodedAccessToken = jwt.verify(accessToken, accessTokenSecret);
      const user = await User.findById(decodedAccessToken.userId).select(
        "-password",
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      throw error;
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const adminRouter = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(401)
      .json({ message: "Unauthorized! You are not an admin" });
  }
};

export const AuthMiddleware = { protectedRoutes, adminRouter };
