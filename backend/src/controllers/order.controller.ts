import { Request, Response } from 'express';
import { prisma } from '../lib/db';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || items.length === 0) {
      res.status(400).json({ error: 'userId dan items wajib diisi' });
      return;
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true, user: { select: { id: true, name: true, email: true } } },
    });

    res.status(201).json({ message: 'Pesanan berhasil dibuat', order });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ error: 'Gagal membuat pesanan' });
  }
};

export const getOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data pesanan' });
  }
};
