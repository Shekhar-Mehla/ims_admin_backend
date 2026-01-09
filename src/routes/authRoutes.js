import express from "express";
import registerDataValidator, {
  activateDataValidator,
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
  activateAccountController,
  getProfileController,
  refreshAccessTokenController,
  inviteStaffController,
  getAllUsersController,
  deleteUserController,
} from "../controllers/authController.js";
import {
  renewAccessTokenMiddleware,
  userAuthMiddleware,
  adminAuthMiddleware,
} from "../middlewares/authMiddleware.js";
const authRoutes = express.Router();

authRoutes.post("/register", registerDataValidator, registerController);
authRoutes.post("/activate", activateDataValidator, activateAccountController);
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
// profile route
authRoutes.get("/profile", userAuthMiddleware, getProfileController);
// get all users route (Admin Only)
authRoutes.get("/all", userAuthMiddleware, adminAuthMiddleware, getAllUsersController);
// delete user route (Admin Only)
authRoutes.delete("/delete-user/:id", userAuthMiddleware, adminAuthMiddleware, deleteUserController);

// invite staff route (Admin Only)
authRoutes.post(
  "/invite-staff",
  userAuthMiddleware,
  adminAuthMiddleware,
  inviteStaffController
);

// refresh token route
authRoutes.post("/refresh-token", refreshAccessTokenController);
export default authRoutes;
