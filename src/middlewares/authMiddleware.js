import {
  checkUserByEmail,
  getAuthUserById,
  getUserProfileByAuthId,
} from "../models/Auth/authModel.js";
import { getsessionByAccessToken } from "../models/Session/sessionModel.js";
import { getProfile } from "../models/Profile/profileModel.js";
import {
  generateAccessToken,
  verfiyAccessToken,
  verfiyRefreshToken,
} from "../utility/jwts.js";
import responseClient from "../utility/responseClient.js";
import { CLIENT_RENEG_LIMIT } from "tls";

export const registerDataValidationMiddleware = (req, res, next) => {};

// user authentication middleware
export const userAuthMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return responseClient({
      res,
      statusCode: 401,
      message: "Unauthorized: No token provided",
    });
  }
  const token = authorization.split(" ")[1];

  try {
    const decodedtoken = verfiyAccessToken(token);

    if (decodedtoken?.email) {
      const session = await getsessionByAccessToken(token);
      
      

      if (session?._id) {
        const user = await getAuthUserById(session.authId);
        if(user?.verified === false && user?.usertype.includes("staff")){
          // redirct user to change password link
          const changePasswordLink = `${process.env.FRONTEND_URL}/change-password?token=${token}`;
          return responseClient({
            res,
            statusCode: 401,
            message: "Unauthorized: User not verified",
            payload: changePasswordLink,
          });

          
          
        }

        if (user?._id && user.verified == true) {
          user.password = undefined;
          // Prefer role info from token if available (fewer DB reads), else fallback to user.usertype
          const usertype = user.usertype || [];

          const profile = await getUserProfileByAuthId(user._id);
          req.userInfo = {
            _id: user._id,
            email: user.email,
            usertype: usertype,
            isAdmin: profile?.isAdmin || false,
          };
          return next();
        } else {
          return responseClient({
            res,
            statusCode: 401,
            message: "Unauthorized: User not found",
          });
        }
      }
    }
  } catch (error) {
    console.error("Authentication error:", error);
    next(error);
  }
};

// middleware to ensure the authenticated user is an admin
export const adminAuthMiddleware = async (req, res, next) => {
  try {
    // userAuthMiddleware should have already populated req.userInfo
    const userInfo = req.userInfo;
    if (!userInfo || !userInfo._id) {
      return responseClient({
        res,
        statusCode: 401,
        message: "Unauthorized: No user information",
      });
    }

    if (userInfo.usertype && userInfo.usertype.includes("admin")) {
      return next();
    }

    return responseClient({
      res,
      statusCode: 403,
      message: "Forbidden: Admins only",
    });
  } catch (error) {
    next(error);
  }
};
// middleware to ensure the authenticated user is a staff member or an admin
export const staffAuthMiddleware = async (req, res, next) => {
  try {
    const userInfo = req.userInfo;
    if (!userInfo || !userInfo._id) {
      return responseClient({
        res,
        statusCode: 401,
        message: "Unauthorized: No user information",
      });
    }

    if (
      userInfo.usertype &&
      (userInfo.usertype.includes("admin") ||
        userInfo.usertype.includes("staff"))
    ) {
      return next();
    }

    return responseClient({
      res,
      statusCode: 403,
      message: "Forbidden: Staff or Admins only",
    });
  } catch (error) {
    next(error);
  }
};
// renew access token middleware
export const renewAccessTokenMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return responseClient({
      res,
      statusCode: 401,
      message: "Unauthorized: No token provided",
    });
  }
  const token = authorization.split(" ")[1];
  try {
    const decodedtoken = verfiyRefreshToken(token);
    if (decodedtoken?.authId) {
      const auth = await checkUserByEmail(decodedtoken.email);
      if (auth?._id && auth.verified == true) {
        const accessToken = await generateAccessToken(
          auth._id,
          req,
          Array.isArray(auth.usertype) ? auth.usertype : []
        );
        return responseClient({
          res,
          statusCode: 200,
          message: "New access token generated",
          payload: accessToken,
        });
      } else {
        return responseClient({
          res,
          statusCode: 401,
          message: "Unauthorized: User not found",
        });
      }
    }
  } catch (error) {
    console.error("Authentication error:", error);
    next(error);
  }
};
