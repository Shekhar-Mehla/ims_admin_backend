import responseClient from "../utility/responseClient.js";

// import { sendVerificationLink } from "../../services/emailService.js";
import { checkUserByEmail, createUser } from "../models/Auth/authModel.js";
import { createProfile } from "../models/Profile/profileModel.js";
import { bcryptPassword } from "../utility/bcrypt.js";
import generateOTP from "../utility/genrateOtp.js";
import { createOtpModel } from "../models/Otp/otpModel.js";
import { otpEmailTemplate } from "../services/email/templates/emailOtp.js";
import { sendEmail } from "../services/email/sendEmail.js";

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
      passwordHash: hashedPassword,
      verified: false,
    });
    if (!auth?._id) {
      return responseClient({
        res,
        statusCode: 400,
        message: "error in creating user",
        payload: null,
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
    console.log(template);
    const mail = await sendEmail({
      to: auth.email,
      subject: otp.purpose,
      template: template,
    });

    // // make url ito activate the account and send the token into url

    // // await sendVerificationLink(email, token);

    // return responseClient({
    //   res,
    //   statusCode: 200,
    //   message: "Registration successful. Please verify your email.",
    //   payload: {
    //     authId: auth._id,
    //     profileId: profile._id,
    //   },
    // });
  } catch (err) {
    console.error("Registration error:", err);
    return responseClient({
      res,
      statusCode: 500,
      message: "Server error during registration",
    });
  }
};
