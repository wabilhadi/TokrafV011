import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { Divisi, Status } from '@prisma/client';

// ─── Public: ACTIVE products only ─────────────────────────────────────────────

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const divisi = req.query.divisi as string | undefined;
    const search = req.query.search as string | undefined;

    const whereClause: any = { status: 'ACTIVE' };
    if (divisi) whereClause.divisi = divisi as Divisi;
    if (search) whereClause.name = { contains: search };

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { images: true, options: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data produk' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, options: true },
    });
    if (!product) {
      res.status(404).json({ error: 'Produk tidak ditemukan' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data produk' });
  }
};

// ─── Admin: All products ───────────────────────────────────────────────────────

export const getAdminProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true, options: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data produk' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name, description, divisi, price, minOrder,
      status, specifications, videoUrl, options, isRecommended
    } = req.body;

    let imageUrl = req.body.imageUrl;

    const files = req.files as Express.Multer.File[];
    const uploadedUrls = files?.length ? files.map(f => f.path) : [];
    
    // Set first image as main thumbnail if none provided
    if (uploadedUrls.length > 0 && !imageUrl) {
      imageUrl = uploadedUrls[0];
    }

    const parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;

    const product = await prisma.product.create({
      data: {
        name: String(name),
        description: String(description),
        divisi: divisi as Divisi,
        price: parseFloat(String(price)),
        minOrder: parseInt(String(minOrder)) || 1,
        status: (status as Status) || 'ACTIVE',
        specifications: specifications === '' ? null : (specifications ? String(specifications) : undefined),
        imageUrl: imageUrl === '' ? null : (imageUrl ? String(imageUrl) : undefined),
        videoUrl: videoUrl === '' ? null : (videoUrl ? String(videoUrl) : undefined),
        isRecommended: isRecommended === 'true' || isRecommended === true,
        options: parsedOptions?.length
          ? {
              create: parsedOptions.map((o: any) => ({
                name: o.name,
                values: o.values ? (typeof o.values === 'string' ? o.values : JSON.stringify(o.values)) : JSON.stringify({ uiType: o.uiType, choices: o.choices }),
                required: o.required ?? true,
              })),
            }
          : undefined,
        // Tambah ke tabel Image jika ada uploadedUrls
        images: uploadedUrls.length > 0
          ? { create: uploadedUrls.map(url => ({ url })) }
          : undefined,
      },
      include: { images: true, options: true },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('createProduct error:', error);
    res.status(500).json({ error: 'Gagal membuat produk' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const {
      name, description, divisi, price, minOrder,
      status, specifications, videoUrl, options, isRecommended,
      existingImages // stringified array of image IDs to keep
    } = req.body;
    
    let imageUrl = req.body.imageUrl;

    const files = req.files as Express.Multer.File[];
    const uploadedUrls = files?.length ? files.map(f => f.path) : [];
    
    if (uploadedUrls.length > 0 && !imageUrl) {
      imageUrl = uploadedUrls[0];
    }

    const parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;

    // Delete old options then recreate
    await prisma.productOption.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: String(name),
        description: String(description),
        divisi: divisi as Divisi,
        price: parseFloat(String(price)),
        minOrder: parseInt(String(minOrder)) || 1,
        status: status as Status,
        specifications: specifications === '' ? null : (specifications ? String(specifications) : undefined),
        imageUrl: imageUrl === '' ? null : (imageUrl ? String(imageUrl) : undefined),
        videoUrl: videoUrl === '' ? null : (videoUrl ? String(videoUrl) : undefined),
        isRecommended: isRecommended === 'true' || isRecommended === true,
        options: parsedOptions?.length
          ? {
              create: parsedOptions.map((o: any) => ({
                name: o.name,
                values: o.values ? (typeof o.values === 'string' ? o.values : JSON.stringify(o.values)) : JSON.stringify({ uiType: o.uiType, choices: o.choices }),
                required: o.required ?? true,
              })),
            }
          : undefined,
      },
    });

    // Handle existing images
    if (existingImages) {
      const imagesToKeep = JSON.parse(existingImages);
      await prisma.image.deleteMany({
        where: {
          productId: id,
          id: { notIn: imagesToKeep }
        }
      });
    }

    // Add new images
    if (uploadedUrls.length > 0) {
      await prisma.image.createMany({
        data: uploadedUrls.map(url => ({ url, productId: id }))
      });
    }
    
    const finalProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true, options: true }
    });

    res.json(finalProduct);
  } catch (error) {
    console.error('updateProduct error:', error);
    res.status(500).json({ error: 'Gagal memperbarui produk' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.product.delete({ where: { id: String(req.params.id) } });
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus produk' });
  }
};
