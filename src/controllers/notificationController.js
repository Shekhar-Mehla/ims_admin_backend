import { getAllAdminNotifications } from "../models/Notification/notificationModel.js";
import { getallUsers } from "../models/Profile/profileModel.js";
import { createNotifications } from "../services/notification/createNotification.js";
import responseClient from "../utility/responseClient.js";

// Admin sends a notification to a user
export const sendNotificationToUser = async (req, res, next) => {
  try {
    const { profileId, authId, subject, body, email, type } = req.body;
    const createdBy = req.userInfo?.email;

    if (!subject || !body || !email || !type || (!profileId && !authId)) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Missing required fields",
      });
    }

    const notification = await createNotifications({
      profileId: profileId || null,
      authId: authId || null,
      subject,
      body,
      email,
      type,
      createdBy,
    });

    return responseClient({
      res,
      statusCode: 201,
      message: "Notification sent successfully",
      payload: notification,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return responseClient({
      res,
      statusCode: 500,
      message: "Failed to send notification",
    });
  }
};

export const viewAdminNotifications = async (req, res, next) => {
  try {
    const adminEmail = req.userInfo?.email;

    if (!adminEmail) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Admin email missing",
      });
    }

    const notifications = await getAllAdminNotifications(adminEmail);

    if (!notifications || notifications.length === 0) {
      return responseClient({
        res,
        statusCode: 404,
        message: "No notifications found for this admin",
      });
    }

    return responseClient({
      res,
      statusCode: 200,
      message: "Admin notifications fetched successfully",
      payload: notifications,
    });
  } catch (error) {
    console.error("Error fetching admin notifications:", error);
    return responseClient({
      res,
      statusCode: 500,
      message: "Failed to fetch admin notifications",
    });
  }
};
export const sendNotificationToAllUsers = async (req, res, next) => {
  try {
    const { subject, body, type } = req.body;
    const createdBy = req.userInfo?.email;

    if (!subject || !body || !type) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Missing required fields",
      });
    }

    const profiles = await getallUsers()
    if (!profiles.length) {
      return responseClient({
        res,
        statusCode: 404,
        message: "No users found",
      });
    }

    const notifications = await Promise.all(
      profiles.map((profile) =>
        createNotifications({
          profileId: profile._id,
          authId: null,
          subject,
          body,
          email: profile.email,
          type,
          createdBy,
        })
      )
    );

    return responseClient({
      res,
      statusCode: 201,
      message: "Notifications sent to all users",
      payload: notifications,
    });
  } catch (error) {
    console.error("Error sending bulk notifications:", error);
    return responseClient({
      res,
      statusCode: 500,
      message: "Failed to send notifications",
    });
  }
};
