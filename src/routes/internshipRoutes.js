import express from "express";
import {
  createInternshipController,
  getIntershipBySlugController,
  getIntershipController,
  updateInternshipController,
  deleteInternshipController,
} from "../controllers/internshipController.js";
import { userAuthMiddleware } from "../middlewares/authMiddleware.js";

const intershipRoutes = express.Router();

// Create internship (protected)
intershipRoutes.post(
  "/add-intership",
  userAuthMiddleware,
  createInternshipController
);

// Get all internships (public)
intershipRoutes.get("/", getIntershipController);

// Get internship by slug (public)
intershipRoutes.get("/:slug", getIntershipBySlugController);

// Update internship by ID (protected)
intershipRoutes.put(
  "/update/:id",
  userAuthMiddleware,
  updateInternshipController
);

// Delete internship by ID (protected)
intershipRoutes.delete(
  "/delete/:id",
  userAuthMiddleware,
  deleteInternshipController
);

export default intershipRoutes;
