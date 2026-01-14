import bcrypt from "bcrypt";

export const bcryptPassword = async (password) => {
  try {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
  } catch (err) {
    console.error("Error hashing password:", err);
  }
};
export const comparePassword = async (password, hash) => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    next(error);
  }
};
