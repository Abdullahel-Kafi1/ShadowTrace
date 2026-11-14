import { z } from "zod";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/token.js";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72)
});

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72)
});

export const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Please check the registration information.",
      errors: parsed.error.flatten().fieldErrors
    });
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return res.status(409).json({ message: "An account with this email already exists." });

  // Never accept a role from public registration.
  const user = await User.create({ name, email: normalizedEmail, password, role: "user" });
  const token = signToken(user._id.toString());
  setAuthCookie(res, token);

  res.status(201).json({
    message: "Account created successfully.",
    user: user.toSafeObject()
  });
});

export const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Please enter a valid email and password." });
  }

  const email = parsed.data.email.toLowerCase();
  const user = await User.findOne({ email }).select("+password");
  const valid = user && await user.comparePassword(parsed.data.password);

  if (!valid) return res.status(401).json({ message: "Incorrect email or password." });

  setAuthCookie(res, signToken(user._id.toString()));
  res.json({ message: "Login successful.", user: user.toSafeObject() });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out successfully." });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});
