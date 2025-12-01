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

    const feedbackData = await prisma.feedback.findMany({
        where: {
            userID: req.user.id
        },
        skip: skip,
        take: limit,
    });

    const totalFeedback = await prisma.feedback.count({
        where: {
            userID: req.user.id
        }
    });

    res.status(200).json({
        data: feedbackData,
        currentPage: page,
        totalPages: Math.ceil(totalFeedback / limit),
        totalItems: totalFeedback,
    });
});
