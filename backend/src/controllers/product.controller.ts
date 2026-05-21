import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { Divisi, Status } from '@prisma/client';

// Get all products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get single product
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, divisi, price, minOrder, status, specifications } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        divisi: divisi as Divisi,
        price,
        minOrder,
        status: status as Status || 'ACTIVE',
        specifications
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, description, divisi, price, minOrder, status, specifications } = req.body;
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        divisi: divisi as Divisi,
        price,
        minOrder,
        status: status as Status,
        specifications
      }
    });
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.product.delete({
      where: { id }
    });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
