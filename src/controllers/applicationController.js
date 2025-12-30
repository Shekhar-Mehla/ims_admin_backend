import {
  applyApplicationModel,
  getAllApplicationsModel,
  getApplicationByIdModel,
  updateApplicationStatusModel,
} from "../models/Application/applicationModel.js";
import { createNotification } from "../models/Notification/notificationModel.js";
import notificationCollection from "../models/Notification/notificationSchema.js";
import responseClient from "../utility/responseClient.js";
import mongoose from "mongoose";
export const applyController = async (req, res, next) => {
  try {
    const { internshipId, profileId, resumeUrl, publicResumeId } = req.body;
    const applicationData = {
      internshipId,
      profileId,
      resumeUrl,
      publicResumeId,
    };
    const checkExistingApplication = await getApplicationByIdModel(profileId);
    if (checkExistingApplication) {
      return responseClient({
        res,
        statusCode: 400,
        message: "You have already applied for this internship",
      });
    }
    const application = await applyApplicationModel(applicationData);
    if (!application) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Failed to apply for the internship",
      });
    }
    return responseClient({
      res,
      message: "Successfully applied for the internship",
    });
  } catch (error) {
    next(error);
  }
};
// get all applications controller
export const getAllApplicationsController = async (req, res, next) => {
  try {
    // logic to get all applications will go here
    const applications = await getAllApplicationsModel();
    if (!applications) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Failed to get all applications",
      });
    }
    return responseClient({
      res,
      message: "Get all applications controller is working",
      payload: applications,
    });
  } catch (error) {
    next(error);
  }
};
// get application by id controller
export const getApplicationByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await getApplicationByIdModel(id);
    if (!application) {
      return responseClient({
        res,
        statusCode: 404,
        message: "Application not found",
      });
    }
    return responseClient({
      res,
      message: "Get application by id controller is working",
      payload: application,
    });
  } catch (error) {
    next(error);
  }
};
export const updateApplicationStatusController = async (req, res, next) => {
  try {
    const { status } = req.body;

    const { id } = req.params;

    const updatedApplication = await updateApplicationStatusModel(id, status);

    if (!updatedApplication) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Failed to update application status",
      });
    }

    //notify user about the status update via email (to be implemented)

    // save notification to db

    const notificationData = {
      authId: new mongoose.Types.ObjectId(
        updatedApplication.profileId._id || updatedApplication.profileId
      ),
      message: `Your application status is ${status}`,
      type: "application_update",
      referenceId: updatedApplication._id,
      referenceModel: "Application",
    };

    await createNotification(notificationData);
    // notify user using socket
    const io = req.app.get("io"); // get socket.io instance
    const userRoom = updatedApplication?.profileId?._id.toString();
    io.to(userRoom).emit("applicationStatusUpdated", {
      applicationId: id,
      newStatus: status,
      message: `Your application status changed to ${status}`,
    });
    const unreadCount = await notificationCollection.countDocuments({
      isRead: false,
      authId: updatedApplication?.profileId?._id.toString(),
    });
    io.to(userRoom).emit("unreadCount", unreadCount);
    return responseClient({
      res,
      message: "Application status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
