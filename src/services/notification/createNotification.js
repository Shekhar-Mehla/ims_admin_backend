import { createNotificationModel } from "../../models/Notification/notificationModel.js";

/**
 * Create a notification for a user or system event
 * @param {Object} params
 * @param {String|null} params.profileId - User's profile ID (null if not created yet)
 * @param {String|null} params.authId - Auth ID (used before profile creation)
 * @param {String} params.type - Notification type (e.g. 'otp', 'internship_posted')
 * @param {String} params.subject - Short title of the notification
 * @param {String} params.body - Detailed message
 * @param {String} params.email - User's email
 * @returns {Object} - Saved notification document
 */
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
