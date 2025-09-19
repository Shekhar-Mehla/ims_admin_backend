import authCollection from "./authSchema.js";

export const checkUserByEmail = async (email) =>
  await authCollection.findOne({ email });
export const getUserById = async (id) => await authCollection.findById(id);
export const createUser = async (data) => await authCollection(data).save();
export const updateRefreshToken = async (email, refreshToken) =>
  await authCollection.findOneAndUpdate(
    { email },
    { refreshToken },
    { new: true }
  );

export const updateUser = async (filter, update) =>
  await authCollection.findOneAndUpdate(filter, update, { new: true });
