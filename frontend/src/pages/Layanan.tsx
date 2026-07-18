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
      <div className="pt-28 pb-8 px-6 md:px-12 max-w-[1400px] mx-auto border-b border-foreground/10">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight leading-tight mb-4`}
        >
          {searchQuery 
            ? `Search: "${searchQuery}"` 
            : currentCategory === 'all' ? 'All Services.' : `${currentCategory.replace('-', ' ')}.`
          }
        </motion.h1>
        {searchQuery && (
           <p className="text-foreground/60 mb-8">
             Menampilkan hasil pencarian untuk "{searchQuery}"
           </p>
        )}
        
        <div className="flex flex-wrap gap-3 mt-8">
          {tabs.map((tab) => (
            <Link 
              key={tab.id} 
              to={tab.path} 
              className={`px-8 py-4 rounded-full font-sans font-medium text-sm uppercase tracking-widest transition-all duration-300 ${
                currentCategory === tab.id 
                  ? 'bg-foreground text-background' 
                  : 'bg-transparent text-foreground border border-foreground/20 hover:border-foreground'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Masonry Grid Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16">
        {loading ? (
          <div className="text-center text-xl font-light py-20">{t('layanan.loading')}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-xl font-light py-20">{t('layanan.noProducts')}</div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-6 md:gap-8 space-y-8 md:space-y-12">
            <AnimatePresence>
              {filteredProducts.map((product, idx) => (
                <div key={product.id} className="break-inside-avoid">
                  <ProductCard product={product} idx={idx} tabs={tabs} />
                </div>
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
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Randomize aspect ratios for Outfit aesthetic (3/4, 4/5, or 1/1)
  const aspectRatios = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square'];
  const aspectRatio = aspectRatios[idx % aspectRatios.length];

  // Randomize width and alignment to create a loose, chaotic, free-flowing moodboard
  const widths = ['w-full', 'w-[85%]', 'w-[90%]'];
  const widthClass = widths[idx % widths.length];
  
  const alignments = ['self-start', 'self-end', 'self-center'];
  const alignClass = alignments[idx % alignments.length];

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col group ${widthClass} ${alignClass}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/produk/${product.id}`} className="block relative">
        <div className={`relative overflow-hidden bg-secondary/50 rounded-3xl ${aspectRatio} mb-8 shadow-sm transition-shadow duration-500 hover:shadow-xl`}>
          {/* Fallback Image */}
          {product.imageUrl ? (
            <motion.img 
              src={product.imageUrl.startsWith('http') ? product.imageUrl : `https://tokraf-backend.vercel.app${product.imageUrl}`} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-secondary text-foreground/30 font-medium text-sm">
              No Image
            </div>
          )}
          
          {/* Hover Video Overlay */}
          {product.videoUrl && (
            <motion.video 
              ref={videoRef}
              src={product.videoUrl} 
              className="absolute inset-0 w-full h-full object-cover"
              muted 
              loop 
              playsInline
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            />
          )}

          {/* Centered Action Button on Hover */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-background text-foreground px-8 py-4 rounded-full font-sans font-bold text-sm tracking-widest shadow-2xl backdrop-blur-md bg-opacity-90">
              {product.videoUrl ? 'PLAY VIDEO' : 'VIEW PRODUCT'}
            </div>
          </motion.div>
        </div>

        <div className="flex justify-between items-start">
          <div className="pr-4">
            <h3 className="text-xl md:text-2xl font-medium font-sans text-foreground mb-1 leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-foreground/60 text-xs md:text-sm font-sans max-w-sm line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] md:text-xs font-bold font-sans uppercase tracking-widest text-foreground/80 mb-1">
              {tabs.find(t => t.id === product.category)?.label || product.category}
            </p>
            <p className="text-lg font-medium font-sans text-foreground">
              Rp {Number(product.price || 0).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
