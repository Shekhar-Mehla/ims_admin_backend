import jwt from "jsonwebtoken";
import { updateRefreshToken } from "../models/Auth/authModel.js";
import { createSession } from "../models/Session/sessionModel.js";

export const generateAccessToken = async (authId, req) => {
  const accessToken = await jwt.sign(
    { authId: authId.toString() },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
  
  const obj = {
    authId,
    accessToken,
    userAgent: req.headers["user-agent"] || null,
    ip: req.ip || null,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
  };

  await createSession(obj);
  return accessToken;
};

export const verfiyAccessToken = (token) => {
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return decoded;
};
export const generateRefreshToken = async (email) => {
  const refreshToken = await jwt.sign(
    { email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  console.log(refreshToken, ".......");
  const user = await updateRefreshToken(email, refreshToken);
  console.log(user);
  return refreshToken;
};
export const verfiyRefreshToken = (token) => {
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  return decoded;
};

export const generatejwts = async (authId, email, req) => {
  const obj = {
    accessToken: await generateAccessToken(authId, req),
    refreshToken: await generateRefreshToken(email),
  };

  return obj;
};
