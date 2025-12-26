import internshipCollection from "./internshipSchema.js";

// Create internship
export const createIntership = async (obj) =>
  await internshipCollection(obj).save();

// Get all internships
export const getAllIntership = async () =>
  await internshipCollection.find({}, { __v: 0 });

// Get internship by slug
export const getIntershipDetailBySlug = async (slug) =>
  await internshipCollection.findOne({ slug });

// Update internship by slug
export const updateInternshipBySlug = async (slug, updateData) =>
  await internshipCollection.findOneAndUpdate({ slug }, updateData, {
    new: true,
  });

// Delete internship by ID
export const deleteInternshipById = async (id) =>
  await internshipCollection.findByIdAndDelete(id);
