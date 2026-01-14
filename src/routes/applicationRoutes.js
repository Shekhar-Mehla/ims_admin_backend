import express from "express";
import {
  userAuthMiddleware,
  adminAuthMiddleware,
  staffAuthMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  getAllApplicationsController,
  getApplicationByIdController,
  updateApplicationStatusController,
  deleteApplicationController,
} from "../controllers/applicationController.js";

const applicationRoutes = express.Router();

export default applicationRoutes;

// get all applications
applicationRoutes.get(
  "/get-all-applications",
  userAuthMiddleware,
  staffAuthMiddleware,
  getAllApplicationsController
);
// get application by id
applicationRoutes.get(
  "/get-application-by-id/:id",
  userAuthMiddleware,
  getApplicationByIdController
);
// update application status
applicationRoutes.patch(
  "/update-application-status/:id",
  userAuthMiddleware,
  staffAuthMiddleware,
  updateApplicationStatusController
);

// delete application route
applicationRoutes.delete(
  "/delete/:id",
  userAuthMiddleware,
  staffAuthMiddleware,
  deleteApplicationController
);
