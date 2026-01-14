import {
  applyApplicationModel,
  getAllApplicationsModel,
  getApplicationByIdModel,
  updateApplicationStatusModel,
} from "../models/Application/applicationModel.js";
import { createNotification } from "../models/Notification/notificationModel.js";
import notificationCollection from "../models/Notification/notificationSchema.js";
import applicationCollection from "../models/Application/applicationSchema.js";
import responseClient from "../utility/responseClient.js";
import mongoose from "mongoose";
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

    // Allow access if requester is the owner (profile.authId) or an admin
    const requesterAuthId = req.userInfo?._id?.toString();
    const ownerAuthId = application?.profileId?.authId
      ? application.profileId.authId._id
        ? application.profileId.authId._id.toString()
        : application.profileId.authId.toString()
      : null;


    const isOwner =
      requesterAuthId && ownerAuthId && requesterAuthId === ownerAuthId;

    const isStaffOrAdmin =
      req.userInfo?.usertype?.includes("admin") ||
      req.userInfo?.usertype?.includes("staff") ||
      req.userInfo?.isAdmin;

    if (!isOwner && !isStaffOrAdmin) {
      return responseClient({
        res,
        statusCode: 403,
        message: "Forbidden: You are not allowed to view this application",
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
// delete application controller
export const deleteApplicationController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Application ID is required for deletion",
      });
    }

    // Since we're using staffAuthMiddleware, we know the user is at least staff
    const deletedApplication = await applicationCollection.findByIdAndDelete(id);

    if (!deletedApplication) {
      return responseClient({
        res,
        statusCode: 404,
        message: "Application not found or already deleted",
      });
    }

    return responseClient({
      res,
      statusCode: 200,
      message: "Application deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
