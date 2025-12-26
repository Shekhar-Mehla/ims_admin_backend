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
  "/add-internship",
  userAuthMiddleware,
  createInternshipController
);

// Get all internships (public)
intershipRoutes.get("/get-all-internships", getIntershipController);

// Get internship by slug (public)
intershipRoutes.get("/:slug", getIntershipBySlugController);

// Update internship by ID (protected)
intershipRoutes.put(
  "/update/:slug",
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
