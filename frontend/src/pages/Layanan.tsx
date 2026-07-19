import { useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useTranslation } from '../hooks/useTranslation';
import { TOKRAF_PRODUCTS } from '../lib/products';

type Product = {
  id: string;
  name: string;
  basePrice: number;
  price?: number;
  category: string;
  description: string;
  imageUrl: string | null;
};

const DUMMY_PRODUCTS = TOKRAF_PRODUCTS;

export default function Layanan() {
  const { divisi } = useParams<{ divisi?: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const currentCategory = divisi || 'all';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const tabs = [
    { id: 'all', label: 'Semua', path: '/layanan' },
    { id: 'konveksi', label: 'Konveksi', path: '/layanan/konveksi' },
    { id: 'merch', label: 'Merch', path: '/layanan/merch' },
    { id: 'digital-printing', label: 'Printing', path: '/layanan/digital-printing' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const endpoint = searchQuery
          ? `/products?search=${encodeURIComponent(searchQuery)}`
          : '/products';
        const { data } = await api.get(endpoint);
        if (data) setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  const filteredProducts = products.filter(p => {
    if (currentCategory === 'all') return true;
    const cat = (p.category || (p as any).divisi || '').toLowerCase().replace(/_/g, '-');
    return cat === currentCategory;
  });

  const pageTitle = searchQuery
    ? `Hasil: "${searchQuery}"`
    : currentCategory === 'all' ? 'Semua Produk' : tabs.find(t => t.id === currentCategory)?.label || currentCategory;

  return (
    <div className="w-full min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Page header ── */}
      <div className="section-px pt-4 pb-4 md:pt-8 md:pb-6 border-b border-border/30 bg-background sticky top-[52px] md:top-0 z-30 md:static">
        <div className="section-container">
          <h1 className="font-heading font-bold text-foreground text-xl md:text-4xl leading-tight mb-3 md:mb-5 tracking-tight">
            {pageTitle}
          </h1>

          {/* Category tabs — scroll horizontally on mobile */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`shrink-0 px-4 py-2 rounded-full font-sans font-semibold text-xs md:text-sm transition-all
                  ${currentCategory === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-secondary/60 text-foreground hover:bg-secondary'
                  }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className="section-px pt-4 pb-20 md:pt-8">
        <div className="section-container">
          {loading ? (
            /* Skeleton loader */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 md:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-border/30 animate-pulse">
                  <div className="aspect-square bg-secondary/50" />
                  <div className="p-2 space-y-1.5">
                    <div className="h-2.5 bg-secondary/50 rounded w-2/3" />
                    <div className="h-3 bg-secondary/50 rounded w-full" />
                    <div className="h-3 bg-secondary/50 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-foreground/40">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-heading font-bold text-lg">Produk tidak ditemukan</p>
              <p className="text-sm mt-1">Coba kategori lain atau ubah kata pencarian</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 md:gap-4">
              <AnimatePresence>
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} idx={idx} tabs={tabs} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Product Card — compact Shopee/Tokopedia style
function ProductCard({ product, idx, tabs }: { product: Product; idx: number; tabs: any[] }) {
  const imgSrc = product.imageUrl
    ? (product.imageUrl.startsWith('http')
      ? product.imageUrl
      : `https://tokraf-backend.vercel.app${product.imageUrl}`)
    : null;

  const price = Number(product.price || product.basePrice || 0);
  const categoryLabel = tabs.find(t => t.id === product.category)?.label || product.category;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
    >
      <Link
        to={`/produk/${product.id}`}
        className="group flex flex-col rounded-xl overflow-hidden bg-card border border-border/40 shadow-sm active:scale-[0.97] transition-transform"
      >
        {/* Gambar */}
        <div className="relative w-full aspect-square overflow-hidden bg-secondary/30">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-foreground/30 text-xs">Tidak ada gambar</div>
          )}
        </div>

        {/* Info */}
        <div className="p-2 md:p-3">
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-0.5 truncate">
            {categoryLabel}
          </p>
          <h3 className="text-xs md:text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm md:text-base font-extrabold text-primary font-heading">
            Rp {price.toLocaleString('id-ID')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
