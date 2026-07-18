import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const getReviews = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId as string;
    
    // @ts-ignore
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId as string;
    const name = req.body.name as string;
    const rating = req.body.rating;
    const comment = req.body.comment as string;
    let mediaUrl = null;

    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    }

    // @ts-ignore
    const review = await prisma.review.create({
      data: {
        productId,
        name,
        rating: Number(rating),
        comment,
        mediaUrl,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
