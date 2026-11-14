import jwt from "jsonwebtoken";

export const COOKIE_NAME = "shadowtrace_token";

export function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    issuer: "shadowtrace-api"
  });
}

export function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true" || isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
}
