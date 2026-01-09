import connection from "../dbConfig.js";
import { checkUserByEmail, updateUser } from "../models/Auth/authModel.js";

const email = process.argv[2];
if (!email) {
  console.error("Usage: node promoteAdmin.js <user-email>");
  process.exit(1);
}

(async () => {
  try {
    await connection();
    const user = await checkUserByEmail(email);
    if (!user?._id) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    const updated = await updateUser(
      { _id: user._id },
      { usertype: ["admin"] }
    );
    console.log(`User ${email} promoted to admin.`);
    console.log(updated);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
