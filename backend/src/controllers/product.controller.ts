import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { Divisi, Status } from '@prisma/client';

// ─── Products ────────────────────────────────────────────────────────────────

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { divisi } = req.query;
    const products = await prisma.product.findMany({
      where: divisi ? { divisi: divisi as Divisi, status: 'ACTIVE' } : { status: 'ACTIVE' },
      include: { images: true, options: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: true, options: true },
    });
    if (!product) { res.status(404).json({ error: 'Product not found' }); return; }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, divisi, price, minOrder, status, specifications, imageUrl, videoUrl, options } = req.body;

    const product = await prisma.product.create({
      data: {
        name, description,
        divisi: divisi as Divisi,
        price, minOrder,
        status: (status as Status) || 'ACTIVE',
        specifications, imageUrl, videoUrl,
        // options: array of { name, values, required }
        options: options?.length
          ? { create: options.map((o: any) => ({ name: o.name, values: o.values, required: o.required ?? true })) }
          : undefined,
      },
      include: { images: true, options: true },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const { name, description, divisi, price, minOrder, status, specifications, imageUrl, videoUrl, options } = req.body;

    // Delete old options then recreate (simplest strategy for now)
    await prisma.productOption.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        name, description,
        divisi: divisi as Divisi,
        price, minOrder,
        status: status as Status,
        specifications, imageUrl, videoUrl,
        options: options?.length
          ? { create: options.map((o: any) => ({ name: o.name, values: o.values, required: o.required ?? true })) }
          : undefined,
      },
      include: { images: true, options: true },
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// ─── Admin — All products (including INACTIVE) ────────────────────────────────

export const getAdminProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true, options: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
