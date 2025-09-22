import express from "express";
import {
  createInternshipController,
  getIntershipBySlugController,
  getIntershipController,
} from "../controllers/internshipController.js";
import { userAuthMiddleware } from "../middlewares/authMiddleware.js";
const intershipRoutes = express.Router();

intershipRoutes.post(
  "/add-intership",
  userAuthMiddleware,
  createInternshipController
);
intershipRoutes.get(
  "/",

  getIntershipController,
  getIntershipBySlugController
);
intershipRoutes.get(
  "/:slug",

  getIntershipBySlugController
);

export default intershipRoutes;
