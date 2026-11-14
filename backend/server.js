import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import monitoringRoutes from "./routes/monitoringRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const requiredEnv = ["MONGODB_URI", "JWT_SECRET", "CLIENT_ORIGIN"];
for (const key of requiredEnv) {
  if (!process.env[key]) throw new Error(`${key} is required in backend/.env`);
}
if (process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long.");
}

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again later." }
});

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "ShadowTrace API" }));
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`ShadowTrace API running on port ${PORT}`)))
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
