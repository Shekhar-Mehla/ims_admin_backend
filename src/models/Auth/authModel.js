import profileCollection from "../Profile/profileSchema.js";
import authCollection from "./authSchema.js";

export const checkUserByEmail = async (email) =>
  await authCollection.findOne({ email });


export const getAuthUserById = async (id) => await authCollection.findById(id);


export const createUser = async (data) => await authCollection(data).save();




export const updateRefreshToken = async (email, refreshToken) =>
  await authCollection.findOneAndUpdate(
    { email },
    { refreshToken },

    { new: true, password: 0 }
  );

export const updateUser = async (filter, update) =>
  await authCollection.findOneAndUpdate(filter, update, { new: true });



export const getUserProfileById = async (id) => await profileCollection.findById(id);


export const getUserProfileByAuthId = async (id) =>
  await profileCollection.findOne({ authId: id }).populate("authId", "email verified usertype");


export const deleteAuthUser = async (id) => await authCollection.findByIdAndDelete(id);
