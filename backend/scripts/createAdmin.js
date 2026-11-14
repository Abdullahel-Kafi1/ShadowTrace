import "dotenv/config";
import mongoose from "mongoose";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import User from "../models/User.js";

const rl = readline.createInterface({ input, output });

try {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing.");
  await mongoose.connect(process.env.MONGODB_URI);

  const name = (await rl.question("Administrator name: ")).trim();
  const email = (await rl.question("Administrator email: ")).trim().toLowerCase();
  const password = await rl.question("Administrator password (minimum 8 characters): ");

  if (name.length < 2 || name.length > 80) throw new Error("Name must be 2–80 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  if (password.length < 8 || password.length > 72) throw new Error("Password must be 8–72 characters.");

  let user = await User.findOne({ email }).select("+password");
  if (user) {
    user.name = name;
    user.role = "admin";
    user.password = password;
    await user.save();
    console.log("Existing account promoted to Admin and password updated.");
  } else {
    user = await User.create({ name, email, password, role: "admin" });
    console.log("Administrator account created.");
  }
} catch (error) {
  console.error("Admin setup failed:", error.message);
  process.exitCode = 1;
} finally {
  rl.close();
  await mongoose.disconnect().catch(() => {});
}
