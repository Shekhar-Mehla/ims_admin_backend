import internshipCollection from "./internshipSchema.js";

export const createIntership = async (obj) =>
  await internshipCollection(obj).save();
export const getAllIntership = async () =>
  await internshipCollection.find({}, { __v: 0 });

export const getIntershipDetailBySlug = async (slug) =>
  internshipCollection.findOne({ slug });
