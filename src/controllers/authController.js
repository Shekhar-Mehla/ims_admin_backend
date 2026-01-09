
import responseClient from "../utility/responseClient.js";

// import { sendVerificationLink } from "../../services/emailService.js";
import {
  checkUserByEmail,
  createUser,
 
  getUserProfileByAuthId,
  updateRefreshToken,
  updateUser,
} from "../models/Auth/authModel.js";
import { createProfile } from "../models/Profile/profileModel.js";
import { bcryptPassword, comparePassword } from "../utility/bcrypt.js";
import generateOTP from "../utility/genrateOtp.js";
import { createOtpModel, getOtpCollection } from "../models/Otp/otpModel.js";
import { otpEmailTemplate } from "../services/email/templates/emailOtp.js";
import { sendEmail } from "../services/email/sendEmail.js";
import { generateAccessToken, generatejwts, verfiyRefreshToken } from "../utility/jwts.js";
import { deleteManySessionByAuthId } from "../models/Session/sessionModel.js";

export const registerController = async (req, res) => {
  try {
    const { fName, lName, email, password, technologies, sectors, roles } =
      req.body;

    const existing = await checkUserByEmail(email);
    if (existing) {
      return responseClient({
        res,
        statusCode: 409,
        message: "Email already registered",
        payload: null,
      });
    }
    // hashed the password
    const hashedPassword = await bcryptPassword(req.body.password);

    const auth = await createUser({
      email,
      password: hashedPassword,
      verified: false,
    });
    if (!auth?._id) {
      return responseClient({
        res,
        statusCode: 400,
        message: "error in creating user",
      });
    }
    const profile = await createProfile({
      authId: auth._id,
      fName,
      lName,
      technologies,
      sectors,
      roles,
    });
    if (!profile?._id) {
      return responseClient({
        res,
        statusCode: 400,
        message: "error in creating user profile",
        payload: null,
      });
    }
    // create otp
    const otpCode = generateOTP();
    // store otp into otp collection
    const otpObject = {
      authId: auth._id,
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

    const template = otpEmailTemplate(otp.code);

    const mail = await sendEmail({
      to: auth.email,
      subject: otp.purpose,
      template: template,
    });
    mail
      ? responseClient({
          res,
          statusCode: 201,
          message: "we have sent you an email with verification code",
        })
      : responseClient({
          res,
          statusCode: 400,
          message: "something went wrong try again to register",
        });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

// account activation controller

export const activateAccountController = async (req, res, next) => {
  try {
    const { otp } = req.body;

    // Fetch OTP record from database
    const checkOtp = await getOtpCollection(otp);

    // If OTP is invalid or expired
    if (!checkOtp?._id) {
      return responseClient({
        res,
        statusCode: 400,
        message:
          "OTP you have provided is invalid or expired. Click on 'Generate New OTP' to get a fresh one.",
      });
    }

    // Proceed only if OTP is for email verification
    if (checkOtp.purpose === "email_verification") {
      const user = await updateUser(
        { _id: checkOtp.authId },
        { verified: true }
      );

      if (user?._id) {
        sendEmail({
          to: user.email, // assuming `user` contains the email
          subject: "Account Verified",
          template: `
            <p>Good news — your account has been <strong>successfully verified</strong>! 🎉</p>
            <p>You can now log in and start using all the features available to you.</p>
            <p>Welcome aboard, and thank you for joining us!</p>
            <p>— The IMS Team</p>
          `,
        });

        return responseClient({
          res,
          statusCode: 200,
          message: "Account successfully verified.",
        });
      } else {
        return responseClient({
          res,
          statusCode: 400,
          message: "Something went wrong while verifying your account.",
        });
      }
    } else {
      return responseClient({
        res,
        statusCode: 400,
        message: "OTP purpose mismatch. Cannot verify account.",
      });
    }
  } catch (error) {
    next(error);
  }
};

//login controller

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const auth = await checkUserByEmail(email);

    if (auth?._id) {
      const isMatch = await comparePassword(password, auth.password);

      if (isMatch) {
        // user type check
        if (!auth.usertype.includes("admin") && !auth.usertype.includes("staff")) {
          return responseClient({
            res,
            statusCode: 403,
            message: "Access denied. Admins and Staff only.",
          });
        }
        const jwts = await generatejwts(auth?._id, email, req);

        return responseClient({
          res,
          statusCode: 200,
          message: "login successful",
          payload: jwts,
        });
      }
    } else {
      return responseClient({
        res,
        statusCode: 401,
        message: "Invalid email or password",
      });
    }
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
    console.log(profile, "..............");

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
    console.log(accessToken,"accessToken");

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
      roles: roles || ["staff"],
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


import { getallUsers } from "../models/Profile/profileModel.js";

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

