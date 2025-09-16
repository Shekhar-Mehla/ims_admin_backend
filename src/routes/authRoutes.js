import express from "express";
import registerDataValidator, {
  loginDataValidator,
} from "../joiValidators/registerDataValidator.js";

import {
  generateNewOtpController,
  registerController,
} from "../controllers/authController.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerDataValidator, registerController);
authRoutes.post("/login", loginDataValidator, loginController);
authRoutes.post("/logout", userAuthMiddleware, logoutController);
export default authRoutes;
