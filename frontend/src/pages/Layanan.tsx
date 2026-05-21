import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import { useTranslation } from '../hooks/useTranslation';

type Product = {
  id: string;
  name: string;
  basePrice: number;
  category: string;
  description: string;
  imageUrl: string | null;
  videoUrl?: string | null;
};

// 12 Premium Dummy Products with Images & Videos
const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'd1', name: 'Premium Oversized Hoodie', basePrice: 250000, category: 'konveksi', description: 'High-end heavyweight cotton hoodie with custom embroidery.',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://cdn.pixabay.com/video/2021/08/11/84687-586796328_large.mp4'
  },
  {
    id: 'd2', name: 'Canvas Totebag Aesthetic', basePrice: 45000, category: 'merch', description: 'Durable canvas totebag with minimalist screen print.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'd3', name: 'Art Print Poster A3', basePrice: 20000, category: 'digital-printing', description: 'Gallery-quality fine art printing on textured paper.',
    imageUrl: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'd4', name: 'Varsity Bomber Jacket', basePrice: 350000, category: 'konveksi', description: 'Classic collegiate style bomber jacket with leather sleeves.',
    imageUrl: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40141-424855421_large.mp4'
  },
  {
    id: 'd5', name: 'Custom Enamel Pins', basePrice: 15000, category: 'merch', description: 'Hard enamel pins with vibrant colors and metal plating.',
    imageUrl: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'd6', name: 'Standing X-Banner', basePrice: 120000, category: 'digital-printing', description: 'High-res outdoor/indoor banner with aluminum stand.',
    imageUrl: 'https://images.unsplash.com/photo-1563690623230-0322ba6db7d4?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'd7', name: 'Corporate Polo Shirt', basePrice: 110000, category: 'konveksi', description: 'Breathable pique cotton polo with company logo.',
    imageUrl: 'https://images.unsplash.com/photo-1586363104862-3a5e222ee182?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'd8', name: 'Woven Lanyard', basePrice: 12000, category: 'merch', description: 'Premium woven polyester lanyard with metal hook.',
    imageUrl: 'https://images.unsplash.com/photo-1585435422896-e2603fc5c00e?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://cdn.pixabay.com/video/2021/04/13/70977-536968038_large.mp4'
  },
  {
    id: 'd9', name: 'Packaging Box Custom', basePrice: 8000, category: 'digital-printing', description: 'Corrugated boxes with full-color brand printing.',
    imageUrl: 'https://images.unsplash.com/photo-1605335128031-2945d81cbcc0?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'd10', name: 'Kemeja PDH / Korsa', basePrice: 160000, category: 'konveksi', description: 'Durable drill fabric uniform for organizations.',
    imageUrl: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'd11', name: 'Matte Tumbler Flask', basePrice: 75000, category: 'merch', description: 'Vacuum insulated tumbler with laser engraving.',
    imageUrl: 'https://images.unsplash.com/photo-1610943640030-22cba2bd11d3?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://cdn.pixabay.com/video/2022/10/30/137081-766708605_large.mp4'
  },
  {
    id: 'd12', name: 'Hardcover Notebook', basePrice: 45000, category: 'digital-printing', description: 'Premium bound notebook with custom cover design.',
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a541e4a0ecce?q=80&w=1200&auto=format&fit=crop'
  }
];

export default function Layanan() {
  const { divisi } = useParams<{ divisi?: string }>();
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
        const { data } = await api.get('/products');
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(DUMMY_PRODUCTS);
        }
      } catch (err) {
        setProducts(DUMMY_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    if (currentCategory === 'all') return true;
    const cat = (p.category || (p as any).divisi || '').toLowerCase().replace(/_/g, '-');
    return cat === currentCategory;
  });

  // True Masonry: Split into 3 columns for better sizing on large screens
  const col1 = filteredProducts.filter((_, i) => i % 3 === 0);
  const col2 = filteredProducts.filter((_, i) => i % 3 === 1);
  const col3 = filteredProducts.filter((_, i) => i % 3 === 2);

  return (
    <div className={`w-full min-h-screen pb-40 bg-background text-foreground transition-colors duration-500`}>

      {/* Header Section */}
      <div className="pt-40 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto border-b border-foreground/10">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-6xl md:text-[9rem] font-medium font-sans tracking-tight leading-none mb-12`}
        >
          {currentCategory === 'all' ? 'All Services.' : `${currentCategory.replace('-', ' ')}.`}
        </motion.h1>
        
        <div className="flex flex-wrap gap-3 mt-12">
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
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-32">
        {loading ? (
          <div className="text-center text-xl font-light py-20">{t('layanan.loading')}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-xl font-light py-20">{t('layanan.noProducts')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {/* Column 1 */}
            <div className="flex flex-col gap-24">
              <AnimatePresence>
                {col1.map((product, idx) => (
                  <ProductCard key={product.id} product={product} idx={idx * 3} tabs={tabs} />
                ))}
              </AnimatePresence>
            </div>
            
            {/* Column 2 */}
            <div className="flex flex-col gap-24 md:mt-24">
              <AnimatePresence>
                {col2.map((product, idx) => (
                  <ProductCard key={product.id} product={product} idx={idx * 3 + 1} tabs={tabs} />
                ))}
              </AnimatePresence>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-24 md:mt-48">
              <AnimatePresence>
                {col3.map((product, idx) => (
                  <ProductCard key={product.id} product={product} idx={idx * 3 + 2} tabs={tabs} />
                ))}
              </AnimatePresence>
            </div>
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
          <motion.img 
            src={product.imageUrl?.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`} 
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          
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
            <h3 className="text-3xl font-medium font-sans text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-foreground/60 text-sm font-sans max-w-sm">
              {product.description}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold font-sans uppercase tracking-widest text-foreground/80 mb-2">
              {tabs.find(t => t.id === product.category)?.label || product.category}
            </p>
            <p className="text-lg font-medium font-sans text-foreground">
              Rp {product.basePrice.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
