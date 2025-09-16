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

export const updatePasswordByEmail = async (email, newPassword) =>
  await authCollection.findOneAndUpdate(
    { email },
    { password: newPassword },
    { new: true }
  );
