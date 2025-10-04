import { createNotificationModel } from "../../models/Notification/notificationModel.js";


export const createNotifications = async ({
  profileId = null,
  authId = null,
  type,
  subject,
  body,
  email,
  createdBy,
}) => {
  try {
    if (!type || !subject || !body || !email || !createdBy) {
      throw new Error("Missing required notification fields");
    }

    const notification = await createNotificationModel({
      profileId,
      authId,
      type,
      subject,
      body,
      email,
      createdBy,
      sentAt: new Date(),
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
