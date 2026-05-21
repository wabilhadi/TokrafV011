import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCheckoutOrder = async (req: Request, res: Response) => {
  try {
    const { name, whatsapp, address, items, totalAmount } = req.body;

    if (!name || !whatsapp || !address || !items || items.length === 0) {
      return res.status(400).json({ message: 'Semua field (nama, wa, alamat, keranjang) wajib diisi' });
    }

    // 1. Silent Registration / Find Customer
    // Check if customer with this WhatsApp already exists
    let customer = await prisma.customer.findUnique({
      where: { whatsapp }
    });

    // If not exists, create a new customer (Silent Registration)
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name,
          whatsapp,
          address
        }
      });
    }

    // 2. Create Order & OrderItems within a Transaction
    const newOrder = await prisma.order.create({
      data: {
        customerId: customer.id,
        totalAmount,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true,
        customer: true
      }
    });

    res.status(201).json({
      message: 'Pesanan berhasil dibuat',
      order: newOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat memproses pesanan' });
  }
};
