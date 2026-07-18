import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { Divisi } from '@prisma/client';

export const getPortfolios = async (req: Request, res: Response): Promise<void> => {
  try {
    const divisi = req.query.divisi as string | undefined;
    const portfolios = await prisma.portfolio.findMany({
      where: divisi ? { divisi: divisi as Divisi } : undefined,
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data portfolio' });
  }
};

export const getPortfolioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!portfolio) {
      res.status(404).json({ error: 'Portfolio tidak ditemukan' });
      return;
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data portfolio' });
  }
};

export const createPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, clientName, description, divisi, imageUrl } = req.body;
    const uploadedImageUrl = (req as any).file
      ? (req as any).file.path
      : (imageUrl as string | undefined);

    const portfolio = await prisma.portfolio.create({
      data: {
        title: String(title),
        clientName: clientName ? String(clientName) : undefined,
        description: description ? String(description) : undefined,
        divisi: divisi as Divisi,
        images: uploadedImageUrl
          ? { create: [{ url: uploadedImageUrl }] }
          : undefined,
      },
      include: { images: true },
    });
    res.status(201).json(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat portfolio' });
  }
};

export const updatePortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { title, clientName, description, divisi, imageUrl } = req.body;
    const uploadedImageUrl = (req as any).file
      ? (req as any).file.path
      : (imageUrl as string | undefined);

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        title: String(title),
        clientName: clientName ? String(clientName) : undefined,
        description: description ? String(description) : undefined,
        divisi: divisi as Divisi,
        ...(uploadedImageUrl && {
          images: {
            deleteMany: {},
            create: [{ url: uploadedImageUrl }],
          },
        }),
      },
      include: { images: true },
    });
    res.json(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui portfolio' });
  }
};

export const deletePortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await prisma.portfolio.delete({ where: { id } });
    res.json({ message: 'Portfolio berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus portfolio' });
  }
};
