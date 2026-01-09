import express from "express";
import {
  userAuthMiddleware,
  adminAuthMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  applyController,
  getAllApplicationsController,
  getApplicationByIdController,
  updateApplicationStatusController,
} from "../controllers/applicationController.js";

const applicationRoutes = express.Router();

export default applicationRoutes;

//apply an application
applicationRoutes.post("/apply", userAuthMiddleware, applyController);

// get all applications
applicationRoutes.get(
  "/get-all-applications",
  userAuthMiddleware,
  adminAuthMiddleware,
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
  adminAuthMiddleware,
  updateApplicationStatusController
);
