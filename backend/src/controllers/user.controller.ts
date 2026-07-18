import { Request, Response } from 'express';
import { prisma } from '../lib/db';

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, name: true, role: true,
        isVerified: true, whatsapp: true, createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data pengguna' });
  }
};

export const toggleUserVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) { res.status(404).json({ error: 'User tidak ditemukan' }); return; }
    const updated = await prisma.user.update({
      where: { id },
      data: { isVerified: !user.isVerified },
      select: { id: true, email: true, name: true, isVerified: true },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui user' });
  }
};

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalProducts, totalUsers, totalPortfolio, totalContacts, unreadContacts] = await Promise.all([
      prisma.product.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.portfolio.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);
    res.json({ totalProducts, totalUsers, totalPortfolio, totalContacts, unreadContacts });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil statistik' });
  }
};
