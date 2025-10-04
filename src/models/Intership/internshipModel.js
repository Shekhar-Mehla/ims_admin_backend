import internshipCollection from "./internshipSchema.js";

// Create internship
export const createIntership = async (obj) =>
  await internshipCollection(obj).save();

// Get all internships
export const getAllIntership = async () =>
  await internshipCollection.find({}, { __v: 0 });

// Get internship by slug
export const getIntershipDetailBySlug = async (slug) =>
  internshipCollection.findOne({ slug });

// Update internship by ID
export const updateInternshipById = async (id, updateData) =>
  await internshipCollection.findByIdAndUpdate(id, updateData, { new: true });

// Delete internship by ID
export const deleteInternshipById = async (id) =>
  await internshipCollection.findByIdAndDelete(id);
