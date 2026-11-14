import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import ExposureRecord from "../models/ExposureRecord.js";
import { hashEmail } from "../utils/privacy.js";

const demoExposures = [
  { email: "demo.user@shadowtrace.test", sourceName: "ShadowTrace Synthetic Breach Dataset A", breachDate: "2024-03-15", exposedDataTypes: ["Email address", "Username", "Password hash"], severity: "High", description: "Synthetic academic record representing an account exposure event." },
  { email: "demo.user@shadowtrace.test", sourceName: "ShadowTrace Synthetic Forum Dataset B", breachDate: "2023-08-02", exposedDataTypes: ["Email address"], severity: "Low", description: "Synthetic academic record containing an email identifier only." },
  { email: "student@shadowtrace.test", sourceName: "ShadowTrace Synthetic Education Dataset", breachDate: "2025-01-20", exposedDataTypes: ["Email address", "Username"], severity: "Medium", description: "Synthetic academic record for demonstrating a monitoring result." }
];

try {
  await connectDB();
  for (const item of demoExposures) {
    const { email, ...record } = item;
    const emailHash = hashEmail(email);
    await ExposureRecord.updateOne(
      { emailHash, sourceName: record.sourceName },
      { $set: { ...record, emailHash, isSynthetic: true, datasetVersion: "academic-demo-v1" } },
      { upsert: true }
    );
  }
  console.log("Module 2 demo exposure data seeded.");
} catch (error) {
  console.error("Demo seed failed:", error.message);
  process.exitCode = 1;
} finally { await mongoose.disconnect(); }
