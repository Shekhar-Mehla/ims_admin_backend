import express from "express";
import {
  forgetPasswordDataValidator,
  generateNewOtpDataValidator,
  loginDataValidator,
} from "../joiValidators/registerDataValidator.js";

import {
  forgetPasswordController,
  generateNewOtpController,
  loginController,
  logoutController,
  getProfileController,
  refreshAccessTokenController,
  inviteStaffController,
  getAllUsersController,
  deleteUserController,
  resetPasswordByTokenController,
  getUserProfileByIdController,
  updateAnyUserProfileController,
} from "../controllers/authController.js";
import {
  renewAccessTokenMiddleware,
  userAuthMiddleware,
  adminAuthMiddleware,
  staffAuthMiddleware,
} from "../middlewares/authMiddleware.js";
const authRoutes = express.Router();


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
// get all users route (Admin/Staff)
authRoutes.get(
  "/all",
  userAuthMiddleware,
  staffAuthMiddleware,
  getAllUsersController
);
// get user profile by id route (Admin/Staff)
authRoutes.get(
  "/profile/:id",
  userAuthMiddleware,
  staffAuthMiddleware,
  getUserProfileByIdController
);
// delete user route (Admin Only)
authRoutes.delete(
  "/delete-user/:id",
  userAuthMiddleware,
  adminAuthMiddleware,
  deleteUserController
);

// update user route (Admin Only)
authRoutes.put(
  "/update-user/:id",
  userAuthMiddleware,
  adminAuthMiddleware,
  updateAnyUserProfileController
);

// invite staff route (Admin Only)
authRoutes.post(
  "/invite-staff",
  userAuthMiddleware,
  adminAuthMiddleware,
  inviteStaffController
);

// refresh token route
authRoutes.post("/refresh-token", refreshAccessTokenController);

// reset password by token route
authRoutes.post("/reset-password-token", resetPasswordByTokenController);

export default authRoutes;
