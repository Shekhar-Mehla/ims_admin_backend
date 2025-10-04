import { updateNotificationStatus } from "../models/Notification/notificationModel.js";
import responseClient from "../utility/responseClient.js";

export const notificationUpdateController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    // logic to update the notification with the given id
    await updateNotificationStatus(id, { isRead, readAt: new Date() });
    return responseClient({
      res,
      statusCode: 200,
      message: `Notification with id ${id} updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};
