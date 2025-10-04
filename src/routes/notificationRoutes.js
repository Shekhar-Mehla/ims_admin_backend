import express from "express";
<<<<<<< HEAD
import { userAuthMiddleware } from "../middlewares/authMiddleware.js";
const notificationRouter = express.Router();
notificationRouter.patch(
  "/update/:id",
  userAuthMiddleware,
  notificationUpdateController
);
=======
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
>>>>>>> feature/internShip

export default notificationRouter;
