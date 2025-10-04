import express from "express";
import {
  sendNotificationToUser,
  viewAdminNotifications,
} from "../controllers/notificationController.js";
import { userAuthMiddleware } from "../middlewares/authMiddleware.js";

const notificationRouter = express.Router();

//  Admin sends a notification to a user
notificationRouter.post("/send", userAuthMiddleware, sendNotificationToUser);

//  Admin views all notifications they’ve sent
notificationRouter.get("/all", userAuthMiddleware, viewAdminNotifications);

export default notificationRouter;
