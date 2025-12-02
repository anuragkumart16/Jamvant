import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// router imports
import healthCheckRouter from "./routes/healthCheck.js";
import authRouter from "./routes/auth.js";
import feedbackRouter from "./routes/feedback.js";
import floatRouter from "./routes/float.js";

app.use("/healthcheck", healthCheckRouter);
app.use("/auth", authRouter);
app.use("/feedback", feedbackRouter);
app.use("/floats", floatRouter);

import { startScheduler } from "./services/scheduler.js";
startScheduler();

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

export default app;
