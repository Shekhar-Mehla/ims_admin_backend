import {
  applyApplicationModel,
  getAllApplicationsModel,
  getApplicationByIdModel,
  updateApplicationStatusModel,
} from "../models/Application/applicationModel.js";
import { createNotification } from "../models/Notification/notificationModel.js";
import responseClient from "../utility/responseClient.js";

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
      authId: updatedApplication.profileId.authId,
      message: `Your application status is ${status}`,
      type: "application_update",
      referenceId: updatedApplication._id,
      referenceModel: "Application",
    };
    await createNotification(notificationData);
    // notify user using socket
    const io = req.app.get("io"); // get socket.io instance

    io.to(updatedApplication.profileId.authId.toString()).emit(
      "applicationStatusUpdated",
      {
        applicationId: id,
        newStatus: status,
        message: `Your application status changed to ${status}`,
      }
    );

    return responseClient({
      res,
      message: "Application status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
