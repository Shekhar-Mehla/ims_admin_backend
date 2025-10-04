import notificationCollection from "./notificationSchema.js";

<<<<<<< HEAD
export const createNotification = (notificationData) =>
  notificationCollection(notificationData).save();

export const updateNotificationStatus = (id, update) =>
  notificationCollection.findByIdAndUpdate(id, update);

export const insertInternshipNotification = async (internshipData) => {
  notificationCollection.insertMany(internshipData);
};
=======
// Create a new notification
export const createNotificationModel = async (data) =>
  await notificationCollection(data).save();

// Get all admin-triggered notifications
export const getAllAdminNotifications = async (adminEmail) =>
  await notificationCollection
    .find({ createdBy: adminEmail })
    .sort({ createdAt: -1 });
>>>>>>> feature/internShip
