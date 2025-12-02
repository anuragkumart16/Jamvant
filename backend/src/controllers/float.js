import asyncHandler from "../utils/asyncHandler.js";
import prisma from "../utils/prisma.js";

export const createFloat = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }
  const floatData = await prisma.floatCollection.create({
    data: { text, userID: req.user.id },
  });
  res.status(201).json(floatData);
});

export const getFloat = asyncHandler(async (req, res) => {
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
    where.text = {
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

  const floatData = await prisma.floatCollection.findMany({
    where,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: order,
    },
  });

  const totalFloats = await prisma.floatCollection.count({ where });

  res.status(200).json({
    data: floatData,
    currentPage: page,
    totalPages: Math.ceil(totalFloats / limit),
    totalItems: totalFloats,
  });
});

export const updateFloat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  const updatedFloat = await prisma.floatCollection.update({
    where: {
      id: id,
      userID: req.user.id,
    },
    data: {
      text,
    },
  });

  res.status(200).json(updatedFloat);
});

export const deleteFloat = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedFloat = await prisma.floatCollection.delete({
    where: {
      id: id,
      userID: req.user.id,
    },
  });

  res.status(200).json({ message: "Float deleted successfully", deletedFloat });
});

export const deleteManyFloats = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "An array of IDs is required" });
  }

  const deletedFloats = await prisma.floatCollection.deleteMany({
    where: {
      id: {
        in: ids,
      },
      userID: req.user.id,
    },
  });

  res
    .status(200)
    .json({ message: `${deletedFloats.count} floats deleted successfully` });
});
