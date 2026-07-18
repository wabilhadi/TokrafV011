import { Request, Response } from 'express';
import { prisma } from '../lib/db';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = String(req.body.name || '');
    const email = String(req.body.email || '');
    const message = String(req.body.message || '');

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Nama, email, dan pesan wajib diisi' });
      return;
    }
    const contact = await prisma.contactMessage.create({ data: { name, email, message } });
    res.status(201).json({ message: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.', id: contact.id });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengirim pesan' });
  }
};

export const getContactMessages = async (_req: Request, res: Response): Promise<void> => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil pesan' });
  }
};

export const markContactRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const updated = await prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui pesan' });
  }
};

export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await prisma.contactMessage.delete({ where: { id } });
    res.json({ message: 'Pesan dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus pesan' });
  }
};
