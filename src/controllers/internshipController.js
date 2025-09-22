import {
  createIntership,
  getAllIntership,
  getIntershipDetailBySlug,
} from "../models/Intership/internshipModel.js";
import { getProfile } from "../models/Profile/profileModel.js";
import responseClient from "../utility/responseClient.js";
import slugify from "slugify";

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

// get intership controller
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
  } catch (error) {}
};
