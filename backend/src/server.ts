import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import portfolioRoutes from './routes/portfolio.routes';
import contentRoutes from './routes/content.routes';
import contactRoutes from './routes/contact.routes';
import userRoutes from './routes/user.routes';
import reviewRoutes from './routes/review.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static Files (uploaded images) ──────────────────────────────────────────
const uploadDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadDir));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ message: 'TOKRAF API is running 🚀', version: '1.1.0' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Ukuran file terlalu besar (Maksimal 10MB).' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(500).json({ error: err.message || 'Terjadi kesalahan pada server.' });
  }
  next();
});

if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`\n🚀 TOKRAF Server running on http://localhost:${port}`);
    console.log(`📂 Uploads folder: ${uploadDir}\n`);
  });
}

export default app;
