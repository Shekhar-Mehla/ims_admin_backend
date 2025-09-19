import responseClient from "../utility/responseClient.js";

// import { sendVerificationLink } from "../../services/emailService.js";
import {
  checkUserByEmail,
  createUser,
  updateRefreshToken,
  updateUser,
} from "../models/Auth/authModel.js";
import { createProfile } from "../models/Profile/profileModel.js";
import { bcryptPassword, comparePassword } from "../utility/bcrypt.js";
import generateOTP from "../utility/genrateOtp.js";
import { createOtpModel, getOtpCollection } from "../models/Otp/otpModel.js";
import { otpEmailTemplate } from "../services/email/templates/emailOtp.js";
import { sendEmail } from "../services/email/sendEmail.js";
import { generatejwts } from "../utility/jwts.js";
import { deleteManySessionByAuthId } from "../models/Session/sessionModel.js";

export const registerController = async (req, res) => {
  try {
    const { fName, lName, email, password, technologies, sectors, roles } =
      req.body;
    console.log(req.body);
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
  } catch (err) {
    console.error("Registration error:", err);
    return responseClient({
      res,
      statusCode: 500,
      message: "Server error during registration",
    });
  }
};

// account activation controller

export const activateAccountController = async (req, res, next) => {
  try {
    const { otp } = req.body;

    // Fetch OTP record from database
    const checkOtp = await getOtpCollection(otp);
    console.log(checkOtp);

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
