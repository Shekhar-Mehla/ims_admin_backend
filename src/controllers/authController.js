
import responseClient from "../utility/responseClient.js";

// import { sendVerificationLink } from "../../services/emailService.js";
import {
  checkUserByEmail,
  createUser,
 
  getUserProfileByAuthId,
  updateRefreshToken,
  updateUser,
  getAuthUserById,
} from "../models/Auth/authModel.js";
import { createProfile, getProfile } from "../models/Profile/profileModel.js";
import { bcryptPassword, comparePassword } from "../utility/bcrypt.js";
import generateOTP from "../utility/genrateOtp.js";
import { createOtpModel, getOtpCollection } from "../models/Otp/otpModel.js";
import { otpEmailTemplate } from "../services/email/templates/emailOtp.js";
import { sendEmail } from "../services/email/sendEmail.js";
import { generateAccessToken, generatejwts, verfiyAccessToken, verfiyRefreshToken } from "../utility/jwts.js";
import { deleteManySessionByAuthId } from "../models/Session/sessionModel.js";



//login controller

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const auth = await checkUserByEmail(email);
    

    if (!auth?._id) {
      return responseClient({
        res,
        statusCode: 401,
        message: "Invalid email or password",
      });
    }

    const isMatch = await comparePassword(password, auth.password);

    if (!isMatch) {
      return responseClient({
        res,
        statusCode: 401,
        message: "Invalid email or password",
      });
    }

    // user type check
    if (!auth.usertype.includes("admin") && !auth.usertype.includes("staff")) {
      return responseClient({
        res,
        statusCode: 403,
        message: "Access denied. Admins and Staff only.",
      });
    }

    if (auth?.verified === false) {
      // create token and link to send to the client to change password once he changed password we will update the verified field to true
      const token = await generateAccessToken(auth?._id, email, req);
      const link = `${process.env.ROOT_URL}/reset-password?token=${token}`;
      return responseClient({
        res,
        statusCode: 200,
        message: "change password",
        payload: link,
      });
    }

    const jwts = await generatejwts(auth?._id, email, req);

    return responseClient({
      res,
      statusCode: 200,
      message: "login successful",
      payload: jwts,
    });
  } catch (error) {
    next(error);
  }
};
//logout Controller
export const logoutController = async (req, res, next) => {
  try {
    const { email } = req.userInfo;
    await updateRefreshToken(email, null);
    await deleteManySessionByAuthId(req.userInfo._id);

    return responseClient({
      res,
      statusCode: 200,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};
// generate new otp controller
export const generateNewOtpController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existing = await checkUserByEmail(email);
    if (!existing) {
      return responseClient({
        res,
        statusCode: 404,
        message: "Email not registered",
        payload: null,
      });
    }
    // create otp
    const otpCode = await generateOTP();
    // store otp into otp collection
    const otpObject = {
      authId: existing._id,
      code: otpCode,
      purpose: "email_verification",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
    const otp = await createOtpModel(otpObject);
    // send email with otp

    if (!otp._id) {
      return responseClient({
        res,
        statusCode: 400,
        message: "error in creating otp",
        payload: null,
      });
    }
    sendEmail({
      to: existing.email,
      subject: otp.purpose,
      template: otpEmailTemplate(otp.code),
    });
    await createNotifications({
      profileId: null,
      authId: existing._id,
      subject: "OTP Generated",
      body: `Your OTP  is ${otp.code}`,
      email: existing.email,
      type: "otp",
      createdBy: "system",
    });

    // send email with otp
    return responseClient({
      res,
      statusCode: 200,
      message: "OTP sent successfully",
      payload: otp.code,
    });
  } catch (error) {
    next(error);
  }
};

// forget password controller
export const forgetPasswordController = async (req, res, next) => {
  try {
    const { email, newPassword, otp } = req.body;
    const existing = await checkUserByEmail(email);
    if (!existing) {
      return responseClient({
        res,
        statusCode: 404,
        message: "Email not registered",
        payload: null,
      });
    }
    // hash the new password
    const hashedPassword = await bcryptPassword(newPassword);
    // update the password
    const user = await updateUser({ email }, { password: hashedPassword });
    if (!user._id) {
      return responseClient({
        res,
        message: "something wnet wrong to fetch user. try again",
        statusCode: 400,
      });
    }
    sendEmail({
      to: existing.email,
      subject: "Password Changed",
      template: `<p>Your password has been changed successfully. If you need further assistance, please contact the Admin.</p>`,
    });
    await createNotifications({
      profileId: existing.profileId || null,
      authId: existing._id,
      subject: "Password Reset",
      body: `Your password was successfully reset on ${new Date().toLocaleString()}.`,
      email: existing.email,
      type: "password_reset",
      createdBy: "system",
    });
    // send email notification about password change
    return responseClient({
      res,
      statusCode: 200,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
// get profile controller
export const getProfileController = async (req, res, next) => {
  try {

    const profile = await getUserProfileByAuthId(req.userInfo._id);

    if (!profile) {
      return responseClient({
        res,
        statusCode: 404,
        message: "Profile not found",
      });
    }

    // Combine profile and auth data (ensure email is present in payload)
    const profileObj = profile.toObject();

    // If authId is populated, extract email and flatten authId
    const authData = profileObj.authId || {};
    const email = authData.email || req.userInfo.email;

    const payload = {
      ...profileObj,
      email,
      role: authData.usertype?.[0] || 'user',
      // Keep authId as simple id for frontend
      authId: authData._id || profileObj.authId,
    };

    return responseClient({
      res,
      statusCode: 200,
      message: "Profile retrieved successfully",
      payload,
    });
  } catch (error) {
    next(error);
  }
};


export const updateProfileController = async (req, res, next) => {
  try {
    const { _id } = req.userInfo;
    const { technologies, sectors, roles } = req.body;

    const profile = await updateProfile({ _id }, { technologies, sectors, roles });
    if (!profile) {
      return responseClient({
        res,
        statusCode: 404,
        message: "Profile not found",
      });
    }

    return responseClient({
      res,
      statusCode: 200,
      message: "Profile updated successfully",
      payload: profile,
    });
  } catch (error) {
    next(error);
  }
};
export const refreshAccessTokenController = async (req, res, next) => {

   if (!req.headers.authorization) {
      return responseClient({
        res,
        statusCode: 401,
        message: "Unauthorized: No token provided",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
  try {
   
    
    const decoded = await verfiyRefreshToken(token);
    
    const auth = await checkUserByEmail(decoded.email);
    if (!auth) {
      return responseClient({
        res,
        statusCode: 404,
        message: "User not found",
      });
    }
    const email = auth.email;
    
    
    

    const accessToken = await generateAccessToken(auth._id,email, req);

    return responseClient({
      res,
      statusCode: 200,
      message: "Access token generated successfully",
      payload: accessToken,
    });
  } catch (error) {
    next(error);
  }
};
// invite staff controller
export const inviteStaffController = async (req, res, next) => {
  try {
    const { fName, lName, email, roles } = req.body;

    const existing = await checkUserByEmail(email);
    if (existing) {
      return responseClient({
        res,
        statusCode: 409,
        message: "Email already registered",
        payload: null,
      });
    }

    // Generate random 8-char temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcryptPassword(tempPassword);

    const auth = await createUser({
      email,
      password: hashedPassword,
      verified: false, // User must verify email or just login? User request says "user should get email... mark as active user"
      usertype: ["staff"],
    });

    if (!auth?._id) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Error in creating user",
      });
    }

    const profile = await createProfile({
      authId: auth._id,
      fName,
      lName,
      technologies: [],
      sectors: [],
      roles: [],
    });

    if (!profile?._id) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Error in creating user profile",
      });
    }

    // Send email with credentials
    const template = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to IMS Staff Team!</h2>
        <p>Dear ${fName},</p>
        <p>An account has been created for you as a Staff member.</p>
        <p><strong>Username:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Please login and change your password immediately. This temporary password expires in 24 hours.</p>
        <br/>
        <p>Best Regards,<br/>IMS Admin Team</p>
      </div>
    `;

    const mail = await sendEmail({
      to: auth.email,
      subject: "IMS Staff Account Invitation",
      template: template,
    });

    if (mail) {
      return responseClient({
        res,
        statusCode: 201,
        message: "Staff invited successfully. Credentials sent via email.",
      });
    } else {
      return responseClient({
        res,
        statusCode: 500,
        message: "User created but failed to send email. Please check server logs.",
      });
    }
  } catch (error) {
    next(error);
  }
};


import { getallUsers, updateProfileByAuthId } from "../models/Profile/profileModel.js";

// get all users controller
export const getAllUsersController = async (req, res, next) => {
  try {
    const profiles = await getallUsers();
    
    // Transform data to flatten structure for frontend
    const users = profiles.map(profile => {
      const p = profile.toObject();
      const auth = p.authId || {};
      return {
        ...p,
        email: auth.email,
        verified: auth.verified,
        role: auth.usertype?.[0] || p.roles?.[0] || "user", // Fallback or priority
        _id: auth._id || p.authId, // Ensure we send the Auth ID as the main ID if needed, or Profile ID
        profileId: p._id
      };
    });

    return responseClient({
      res,
      statusCode: 200,
      message: "All users fetched successfully",
      payload: users,
    });
  } catch (error) {
    next(error);
  }
};


import {
  deleteAuthUser
} from "../models/Auth/authModel.js";
import { deleteProfileByAuthId } from "../models/Profile/profileModel.js";

// delete user controller
export const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Optional: Prevent deleting self
    if (req.userInfo._id === id) {
       return responseClient({
        res,
        statusCode: 400,
        message: "You cannot delete your own account.",
      });
    }

    const auth = await deleteAuthUser(id);
    if (!auth) {
      return responseClient({
        res,
        statusCode: 404,
        message: "User not found",
      });
    }

    await deleteProfileByAuthId(id);
    // await deleteManySessionByAuthId(id); // If session model imported

    return responseClient({
      res,
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// reset password by token controller
export const resetPasswordByTokenController = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { authorization } = req.headers;

    if (!authorization) {
      return responseClient({
        res,
        statusCode: 401,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authorization.split(" ")[1];
    const decodedToken = verfiyAccessToken(token);

    if (!decodedToken?.authId) {
      return responseClient({
        res,
        statusCode: 401,
        message: "Unauthorized: Invalid or expired token",
      });
    }

    const hashedPassword = await bcryptPassword(password);
    const user = await updateUser(
      { _id: decodedToken.authId },
      { password: hashedPassword, verified: true }
    );

    if (!user?._id) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Something went wrong while resetting your password.",
      });
    }

    sendEmail({
      to: user.email,
      subject: "Password Reset Successful",
      template: `<p>Your password has been successfully reset. You can now log in with your new password.</p>`,
    });

    return responseClient({
      res,
      statusCode: 200,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

// get user profile by id controller (for Admin/Staff)
export const getUserProfileByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profile = await getProfile(id);

    if (!profile) {
      return responseClient({
        res,
        statusCode: 404,
        message: "Profile not found",
      });
    }

    // Populate auth data if not done in getProfile model
    // Our getProfile model doesn't populate authId, let's do it manually or update model.
    // For now, let's just fetch the auth data separately if needed, or update the profile object.
    
    const profileObj = profile.toObject();
    
    // Fetch auth data to get email and verified status
    const auth = await getAuthUserById(id);

    const payload = {
      ...profileObj,
      email: auth?.email,
      verified: auth?.verified,
      usertype: auth?.usertype,
      authId: id
    };

    return responseClient({
      res,
      statusCode: 200,
      message: "User profile retrieved successfully",
      payload,
    });
  } catch (error) {
    next(error);
  }
};

// update any user profile controller (Admin Only)
export const updateAnyUserProfileController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fName, lName, roles } = req.body;

    // Update profile data
    const profile = await updateProfileByAuthId(id, { fName, lName, roles });

    if (!profile) {
      return responseClient({
        res,
        statusCode: 404,
        message: "Profile not found",
      });
    }

    // If roles are provided, we should also update the usertype in Auth model
    if (roles && roles.length > 0) {
      await updateUser({ _id: id }, { usertype: roles });
    }

    return responseClient({
      res,
      statusCode: 200,
      message: "User updated successfully",
      payload: profile,
    });
  } catch (error) {
    next(error);
  }
};
