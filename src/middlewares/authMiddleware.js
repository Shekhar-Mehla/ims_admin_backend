import { checkUserByEmail, getUserById } from "../models/Auth/authModel.js";
import { getsessionByAccessToken } from "../models/Session/sessionModel.js";
import {
  generateAccessToken,
  verfiyAccessToken,
  verfiyRefreshToken,
} from "../utility/jwts.js";
import responseClient from "../utility/responseClient.js";

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
    if (decodedtoken?.authId) {
      const session = await getsessionByAccessToken(token);
      if (session?._id) {
        const user = await getUserById(session.authId);
        console.log(user, "user from auth middleware");
        if (user?._id && user.verified == true) {
          req.userInfo = user;
          console.log(req.userInfo, "userinfo");
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
      if (auth?._id && user.verified == true) {
        const accessToken = await generateAccessToken(auth._id, req);
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
