import bcrypt from "bcrypt";

export const bcryptPassword = async (password) => {
  try {
    const hashed = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashed);
    return hashed;
  } catch (err) {
    console.error("Error hashing password:", err);
  }
};
