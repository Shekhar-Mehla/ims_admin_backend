
import { createIntership } from "../models/Intership/internshipModel.js";
import responseClient from "../utils/responseClient.js";

// @desc Create new internship (Admin only)
export const createInternship = async (req, res, next) => {
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

    const internship = await createIntership({
      title,
      description,
      company,
      location,
      technologies,
      sectors,
      roles,
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

// @desc Edit internship
