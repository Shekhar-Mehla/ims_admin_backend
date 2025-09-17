import express from "express";
import registerDataValidator, {
  forgetPasswordDataValidator,
  generateNewOtpDataValidator,
  loginDataValidator,
} from "../joiValidators/registerDataValidator.js";

import {
  forgetPasswordController,
  generateNewOtpController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/authController.js";
import {
  renewAccessTokenMiddleware,
  userAuthMiddleware,
} from "../middlewares/authMiddleware.js";
const authRoutes = express.Router();

authRoutes.post("/register", registerDataValidator, registerController);
authRoutes.post("/login", loginDataValidator, loginController);
authRoutes.post("/logout", userAuthMiddleware, logoutController);
authRoutes.post(
  "/generate-new-otp",
  generateNewOtpDataValidator,
  generateNewOtpController
);
authRoutes.post(
  "/forget-password",
  forgetPasswordDataValidator,
  forgetPasswordController
);
authRoutes.post("/renwew-access-token", renewAccessTokenMiddleware);
export default authRoutes;
