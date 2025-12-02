import asyncHandler from "../utils/asyncHandler.js";
import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const signup = asyncHandler(async (req, res) => {
  console.log(req.body);
  const body = req.body;

  const email = body?.email;
  const password = body?.password;
  const pushToken = body?.pushToken;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
      success: false,
      status: 400,
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      message: "Please provide valid email",
      success: false,
      status: 400,
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
      success: false,
      status: 400,
    });
  }

  const alreadyExists = await prisma.User.findUnique({
    where: {
      email: email,
    },
  });

  if (alreadyExists) {
    return res.status(400).json({
      message: "User already exists",
      success: false,
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.User.create({
    data: {
      email: email,
      password: hashedPassword,
      pushToken: pushToken || null,
    },
    select: {
      id: true,
      email: true,
    },
  });

  const token = await jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET
  );

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.SAME_SITE || "none",
      secure: process.env.COOKIE_SECURE || true,
    })
    .json({
      message: "User created successfully",
      success: true,
      status: 200,
      data: user,
      token,
    });
});

export const login = asyncHandler(async (req, res) => {
  const body = req.body;

  const email = body?.email;
  const password = body?.password;
  const pushToken = body?.pushToken;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
      success: false,
      status: 400,
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      message: "Please provide valid email",
      success: false,
      status: 400,
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
      success: false,
      status: 400,
    });
  }

  const user = await prisma.User.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "User not found",
      success: false,
      status: 400,
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      message: "Incorrect password",
      success: false,
      status: 400,
    });
  }

  if (pushToken) {
    await prisma.User.update({
      where: { id: user.id },
      data: { pushToken },
    });
  }

  const token = await jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET
  );

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.SAME_SITE || "none",
      secure: process.env.COOKIE_SECURE || true,
    })
    .json({
      message: "User logged in successfully",
      success: true,
      status: 200,
      data: user,
      token,
    });
});

export const checkEmail = asyncHandler(async (req, res) => {
  const email = req.body?.email;

  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
      success: false,
      status: 400,
    });
  }

  const user = await prisma.User.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    return res.status(400).json({
      message: "Email already exists",
      success: false,
      status: 400,
    });
  }

  return res.status(200).json({
    message: "Email available",
    success: true,
    status: 200,
    data: user,
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await prisma.User.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetPasswordExpires = new Date(Date.now() + 3600000);

  await prisma.User.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetPasswordExpires,
    },
  });

  // Send email via microservice
  try {
    const response = await fetch(process.env.EMAIL_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": process.env.EMAIL_SERVICE_TOKEN,
      },
      body: JSON.stringify({
        recipient: email,
        subject: "Password Reset Request",
        body: `<p>You requested a password reset. Use this token: <b>${resetToken}</b></p>`,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send email", await response.text());
      return res.status(500).json({ message: "Failed to send email" });
    }

    res.status(200).json({ message: "Reset token sent to email" });
  } catch (error) {
    console.error("Email service error", error);
    return res.status(500).json({ message: "Failed to send email" });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  const user = await prisma.User.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.User.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  res.status(200).json({ message: "Password reset successfully" });
});
