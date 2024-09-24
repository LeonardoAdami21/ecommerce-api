import express from "express";
import { adminController } from "./admin.controller.js";
import passport from "passport";
const adminRouter = express.Router();

adminRouter.post("/register", adminController.register);
adminRouter.post("/login", adminController.login);

adminRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

adminRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
);

adminRouter.get("/facebook", passport.authenticate("facebook"));

adminRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
);

export default adminRouter;
