import notificationCollection from "./notificationSchema.js";

// Create a new notification
export const createNotificationModel = async (data) =>
  await notificationCollection(data).save();

// Get all admin-triggered notifications
export const getAllAdminNotifications = async (adminEmail) =>
  await notificationCollection
    .find({ createdBy: adminEmail })
    .sort({ createdAt: -1 });
