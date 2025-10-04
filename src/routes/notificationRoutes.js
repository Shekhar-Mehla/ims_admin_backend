import express from "express";
import { userAuthMiddleware } from "../middlewares/authMiddleware.js";
const notificationRouter = express.Router();
notificationRouter.patch(
  "/update/:id",
  userAuthMiddleware,
  notificationUpdateController
);

export default notificationRouter;
