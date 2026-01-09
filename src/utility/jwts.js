import jwt from "jsonwebtoken";
import {
  updateRefreshToken,
  getAuthUserById,
} from "../models/Auth/authModel.js";
import { createSession } from "../models/Session/sessionModel.js";

// Check if JWT secrets are configured
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_SECRETKEY ||
  process.env.ACCESS_TOKEN_SECRET ||
  "default_access_secret_change_in_production";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_SECRETKEY ||
  process.env.REFRESH_TOKEN_SECRET ||
  "default_refresh_secret_change_in_production";

if (!process.env.ACCESS_SECRETKEY && !process.env.ACCESS_TOKEN_SECRET) {
  console.warn(
    "⚠️  ACCESS_SECRETKEY not set in environment. Using default (not secure for production!)"
  );
}

if (!process.env.REFRESH_SECRETKEY && !process.env.REFRESH_TOKEN_SECRET) {
  console.warn(
    "⚠️  REFRESH_SECRETKEY not set in environment. Using default (not secure for production!)"
  );
}

export const generateAccessToken = async (
  authId,
  email,
  req,
  usertype = []
) => {
  const payload = { email, usertype };
  const accessToken = await jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  const obj = {
    authId,
    accessToken,
    userAgent: req.headers["user-agent"] || null,
    ip: req.ip || null,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
  };

  await createSession(obj);
  return accessToken;
};

export const verfiyAccessToken = (token) => {
  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
  return decoded;
};
export const generateRefreshToken = async (email) => {
  const refreshToken = await jwt.sign({ email }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  const user = await updateRefreshToken(email, refreshToken);

  return refreshToken;
};
export const verfiyRefreshToken = (token) => {
  const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
  return decoded;
};

export const generatejwts = async (authId, email, req) => {
  // fetch user to include roles (usertype) in the access token
  const user = await getAuthUserById(authId);
  const usertype = Array.isArray(user?.usertype) ? user.usertype : [];

  const obj = {
    accessToken: await generateAccessToken(authId, email, req, usertype),
    refreshToken: await generateRefreshToken(email),
  };

  return obj;
};
