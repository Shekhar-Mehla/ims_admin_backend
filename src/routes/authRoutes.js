import express from "express";
import registerDataValidator from "../joiValidators/registerDataValidator.js";

import {
  generateNewOtpController,
  registerController,
} from "../controllers/authController.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerDataValidator, registerController);

export default authRoutes;
