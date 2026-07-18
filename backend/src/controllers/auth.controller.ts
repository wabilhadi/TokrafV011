import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// ─── Login (Only for Admin now) ────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email/No. HP dan password wajib diisi' });
      return;
    }

    // Cari user by email atau nomor WA
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { whatsapp: email }
        ]
      }
    });

    if (!user) {
      res.status(401).json({ error: 'Kredensial tidak valid' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Kredensial tidak valid' });
      return;
    }

    if (user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Akses ditolak. Fitur user telah dinonaktifkan.' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        whatsapp: user.whatsapp,
        address: user.address,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// ─── Get Current User ────────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Tidak ada token' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        whatsapp: true,
        address: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User tidak ditemukan' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};
