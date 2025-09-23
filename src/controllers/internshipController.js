import {
  createIntership,
  deleteInternshipById,
  getAllIntership,
  getIntershipDetailBySlug,
  updateInternshipById,
} from "../models/Intership/internshipModel.js";
import { getProfile } from "../models/Profile/profileModel.js";
import responseClient from "../utility/responseClient.js";
import slugify from "slugify";
import { createNotifications } from "../services/notification/createNotification.js";

//  Create new internship (Admin only)
export const createInternshipController = async (req, res, next) => {
  // posted by
  try {
    const {
      title,
      description,
      company,
      location,
      technologies,
      sectors,
      roles,
    } = req.body;

    const postedBy = req.userInfo._id;
    const getUserProfile = await getProfile(req.userInfo._id);
    const slug = slugify(title);

    if (!getUserProfile?._id) {
      return responseClient({
        res,
        statusCode: 400,
        message: "something went wrong. could not find user",
      });
    }
    const postedByName = `${getUserProfile.fName} ${getUserProfile.lName}`;

    const internship = await createIntership({
      title,
      description,
      company,
      location,
      technologies,
      sectors,
      roles,
      postedBy,
      postedByName,
      slug,
    });
    if (!internship?._id) {
      return responseClient({
        res,
        statusCode: 500,
        data: internship,
        message: "could not created the intership. Internal server Error",
      });
    }
    console.log({
      profileId: getUserProfile?._id,
      authId: null,
      subject: "Internship Posted",
      body: `Your internship "${title}" at ${company} has been successfully posted.`,
      email: req.userInfo.email,
      type: "internship_posted",
      createdBy: req.userInfo?.email || "system",
    });
    await createNotifications({
      profileId: getUserProfile?._id,
      authId: null,
      subject: "Internship Posted",
      body: `Your internship "${title}" at ${company} has been successfully posted.`,
      email: req.userInfo.email,
      type: "internship_posted",
      createdBy: req.userInfo?.email || "system",
    });

    return responseClient({
      res,
      statusCode: 201,
      data: internship,
      message: "Internship created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// get intership list  controller
export const getIntershipController = async (req, res, next) => {
  try {
    const internshipList = await getAllIntership();
    if (!internshipList.length && Array.isArray(internshipList)) {
      return responseClient({
        res,
        statusCode: 500,
        message: "Internal server error",
      });
    }
    return responseClient({
      res,
      message: "here is all intership",
      payload: internshipList,
    });
  } catch (error) {
    next(error);
  }
};
// get intership detail controler
export const getIntershipBySlugController = async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return responseClient({
        res,
        statusCode: 400,
        message: " slug is requred",
      });
    }

    const getIntership = await getIntershipDetailBySlug(slug);
    if (!getIntership?._id) {
      return responseClient({
        res,
        message: "invalid slug or intership may be closed",
        statusCode: 400,
      });
    }
    return responseClient({
      res,
      message: "here is the detail of the intership",
      payload: getIntership,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInternshipController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Internship ID is required for update",
      });
    }

    if (updateData.title) {
      updateData.slug = slugify(updateData.title);
    }

    const updatedInternship = await updateInternshipById(id, updateData);

    if (!updatedInternship?._id) {
      return responseClient({
        res,
        statusCode: 404,
        message: "Internship not found or could not be updated",
      });
    }

    return responseClient({
      res,
      statusCode: 200,
      message: "Internship updated successfully",
      payload: updatedInternship,
    });
  } catch (error) {
    next(error);
  }
};

// Delete internship by ID
export const deleteInternshipController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Internship ID is required for deletion",
      });
    }

    const deletedInternship = await deleteInternshipById(id);

    if (!deletedInternship?._id) {
      return responseClient({
        res,
        statusCode: 404,
        message: "Internship not found or already deleted",
      });
    }

    return responseClient({
      res,
      statusCode: 200,
      message: "Internship deleted successfully",
      payload: deletedInternship,
    });
  } catch (error) {
    next(error);
  }
};
