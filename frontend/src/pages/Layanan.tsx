import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { TOKRAF_PRODUCTS } from '../lib/products';

type Product = {
  id: string;
  name: string;
  basePrice: number;
  category: string;
  description: string;
  imageUrl: string | null;
  videoUrl?: string | null;
};

// Gunakan TOKRAF_PRODUCTS sebagai fallback dummy
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

  const [isHoveringProduct, setIsHoveringProduct] = useState(false);

  const tabs = [
    { id: 'all', label: t('layanan.everything'), path: '/layanan' },
    { id: 'konveksi', label: 'Tokraf Konveksi', path: '/layanan/konveksi' },
    { id: 'merch', label: 'Tokraf Merch', path: '/layanan/merch' },
    { id: 'digital-printing', label: 'Digital Printing', path: '/layanan/digital-printing' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const endpoint = searchQuery 
          ? `/products?search=${encodeURIComponent(searchQuery)}`
          : '/products';
        const { data } = await api.get(endpoint);
        if (data) {
          setProducts(data);
        }
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

  // True Masonry: Split into 3 columns for better sizing on large screens
  // Using CSS columns instead of manual arrays for responsive masonry

  return (
    <div className={`w-full min-h-screen pb-20 bg-background text-foreground transition-colors duration-500`}>

      {/* Header Section */}
      <div className="pt-32 pb-8 px-4 md:px-8 max-w-[1400px] mx-auto border-b border-foreground/10">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold font-heading tracking-tight leading-tight mb-4 text-[clamp(2.5rem,5vw,4.5rem)]"
        >
          {searchQuery 
            ? `Search: "${searchQuery}"` 
            : currentCategory === 'all' ? 'All Services.' : `${currentCategory.replace('-', ' ')}.`
          }
        </motion.h1>
        {searchQuery && (
           <p className="text-foreground/60 mb-8 text-[clamp(1rem,1.5vw,1.125rem)]">
             Menampilkan hasil pencarian untuk "{searchQuery}"
           </p>
        )}
        
        <div className="flex flex-wrap gap-2 md:gap-3 mt-6 md:mt-8">
          {tabs.map((tab) => (
            <Link 
              key={tab.id} 
              to={tab.path} 
              className={`px-5 py-2 md:px-8 md:py-3.5 rounded-full font-sans font-medium text-xs md:text-sm uppercase tracking-widest transition-all duration-300 ${
                currentCategory === tab.id 
                  ? 'bg-foreground text-background shadow-md' 
                  : 'bg-transparent text-foreground border border-foreground/20 hover:border-foreground'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-12 md:mt-16">
        {loading ? (
          <div className="text-center text-xl font-light py-20">{t('layanan.loading')}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-xl font-light py-20">{t('layanan.noProducts')}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-6">
            <AnimatePresence>
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} idx={idx} tabs={tabs} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// Product Card
function ProductCard({ product, idx, tabs }: { product: Product, idx: number, tabs: any[] }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: idx * 0.05, ease: 'easeOut' }}
      className="group relative w-full flex flex-col bg-card rounded-2xl md:rounded-[1.5rem] overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/produk/${product.id}`} className="block relative h-full flex flex-col group">
        <div className="relative w-full aspect-square overflow-hidden rounded-[1rem] bg-secondary/30 mb-3">
          {/* Fallback Image */}
          {product.imageUrl ? (
            <motion.img 
              src={product.imageUrl.startsWith('http') ? product.imageUrl : `https://tokraf-backend.vercel.app${product.imageUrl}`} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-secondary text-foreground/30 font-medium text-xs">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow px-3 md:px-4 pb-4">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/70 mb-1 line-clamp-1">
            {tabs.find(t => t.id === product.category)?.label || product.category}
          </p>
          <h3 className="text-sm md:text-base font-sans font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="text-base md:text-lg font-heading font-extrabold text-foreground mt-auto">
            Rp {Number(product.price || product.basePrice || 0).toLocaleString('id-ID')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
