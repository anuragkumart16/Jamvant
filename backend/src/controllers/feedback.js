import asyncHandler from "../utils/asyncHandler.js";
import prisma from "../utils/prisma.js";

export const createFeedback = asyncHandler(async (req, res) => {
  const { feedback } = req.body;
  if (!feedback) {
    return res.status(400).json({ message: "Feedback is required" });
  }
  const feedbackData = await prisma.feedback.create({
    data: { feedback, userID: req.user.id },
  });
  res.status(201).json(feedbackData);
});

export const getFeedback = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const {
    search,
    sortBy = "createdAt",
    order = "desc",
    startDate,
    endDate,
  } = req.query;

  const where = {
    userID: req.user.id,
  };

  if (search) {
    where.feedback = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  const feedbackData = await prisma.feedback.findMany({
    where,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: order,
    },
  });

  const totalFeedback = await prisma.feedback.count({ where });

  res.status(200).json({
    data: feedbackData,
    currentPage: page,
    totalPages: Math.ceil(totalFeedback / limit),
    totalItems: totalFeedback,
  });
});
