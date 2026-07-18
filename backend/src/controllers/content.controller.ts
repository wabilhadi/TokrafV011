import { Request, Response } from 'express';
import { prisma } from '../lib/db';

export const getContents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const contents = await prisma.content.findMany();
    // Convert array to key-value map for easier use
    const map: Record<string, string> = {};
    contents.forEach(c => { map[c.key] = c.value; });
    res.json(map);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil konten' });
  }
};

export const upsertContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      res.status(400).json({ error: 'Key dan value wajib diisi' });
      return;
    }
    const content = await prisma.content.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menyimpan konten' });
  }
};

export const bulkUpsertContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const entries: { key: string; value: string }[] = req.body;
    const results = await Promise.all(
      entries.map(({ key, value }) =>
        prisma.content.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menyimpan konten' });
  }
};
