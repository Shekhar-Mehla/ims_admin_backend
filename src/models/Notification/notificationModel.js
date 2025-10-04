import notificationCollection from "./notificationSchema.js";

export const createNotification = (notificationData) =>
  notificationCollection(notificationData).save();

export const updateNotificationStatus = (id, update) =>
  notificationCollection.findByIdAndUpdate(id, update);

export const insertInternshipNotification = async (internshipData) => {
  notificationCollection.insertMany(internshipData);
};
