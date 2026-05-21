import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { ShoppingBag, CheckCircle } from 'lucide-react';

const DUMMY_PRODUCTS = [
  {
    id: 'd1', name: 'Premium Oversized Hoodie', price: 250000, divisi: 'KONVEKSI', description: 'High-end heavyweight cotton hoodie with custom embroidery.', minOrder: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    id: 'd2', name: 'Canvas Totebag Aesthetic', price: 45000, divisi: 'MERCH', description: 'Durable canvas totebag with minimalist screen print.', minOrder: 50,
    images: [{ url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    id: 'd3', name: 'Art Print Poster A3', price: 20000, divisi: 'DIGITAL_PRINTING', description: 'Gallery-quality fine art printing on textured paper.', minOrder: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    id: 'd4', name: 'Varsity Bomber Jacket', price: 350000, divisi: 'KONVEKSI', description: 'Classic collegiate style bomber jacket with leather sleeves.', minOrder: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    id: 'd5', name: 'Custom Enamel Pins', price: 15000, divisi: 'MERCH', description: 'Hard enamel pins with vibrant colors and metal plating.', minOrder: 100,
    images: [{ url: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    id: 'd6', name: 'Standing X-Banner', price: 120000, divisi: 'DIGITAL_PRINTING', description: 'High-res outdoor/indoor banner with aluminum stand.', minOrder: 1,
    images: [{ url: 'https://images.unsplash.com/photo-1563690623230-0322ba6db7d4?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    id: 'd7', name: 'Corporate Polo Shirt', price: 110000, divisi: 'KONVEKSI', description: 'Breathable pique cotton polo with company logo.', minOrder: 24,
    images: [{ url: 'https://images.unsplash.com/photo-1586363104862-3a5e222ee182?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    id: 'd8', name: 'Woven Lanyard', price: 12000, divisi: 'MERCH', description: 'Premium woven polyester lanyard with metal hook.', minOrder: 50,
    images: [{ url: 'https://images.unsplash.com/photo-1585435422896-e2603fc5c00e?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    id: 'd9', name: 'Packaging Box Custom', price: 8000, divisi: 'DIGITAL_PRINTING', description: 'Corrugated boxes with full-color brand printing.', minOrder: 100,
    images: [{ url: 'https://images.unsplash.com/photo-1605335128031-2945d81cbcc0?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    id: 'd10', name: 'Kemeja PDH / Korsa', price: 160000, divisi: 'KONVEKSI', description: 'Durable drill fabric uniform for organizations.', minOrder: 24,
    images: [{ url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    id: 'd11', name: 'Matte Tumbler Flask', price: 75000, divisi: 'MERCH', description: 'Vacuum insulated tumbler with laser engraving.', minOrder: 24,
    images: [{ url: 'https://images.unsplash.com/photo-1610943640030-22cba2bd11d3?q=80&w=1200&auto=format&fit=crop' }]
  },
  {
    id: 'd12', name: 'Hardcover Notebook', price: 45000, divisi: 'DIGITAL_PRINTING', description: 'Premium bound notebook with custom cover design.', minOrder: 50,
    images: [{ url: 'https://images.unsplash.com/photo-1531346878377-a541e4a0ecce?q=80&w=1200&auto=format&fit=crop' }]
  }
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      imageUrl: product.images?.[0]?.url
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        if (data) {
          setProduct(data);
        } else {
          // Fallback to dummy
          const dummy = DUMMY_PRODUCTS.find(p => p.id === id);
          setProduct(dummy || null);
        }
      } catch (err) {
        console.error('Failed to fetch product, loading dummy');
        const dummy = DUMMY_PRODUCTS.find(p => p.id === id);
        setProduct(dummy || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="w-full min-h-screen pt-32 text-center text-xl text-foreground/50">Loading product details...</div>;
  if (!product) return <div className="w-full min-h-screen pt-40 pb-20 px-6 max-w-[1400px] mx-auto text-center"><h1 className="text-6xl font-sans font-medium mb-8">Product Not Found.</h1><Link to="/layanan" className="px-8 py-4 rounded-full border border-foreground/20 hover:border-foreground transition-all">Back to Gallery</Link></div>;

  const images = product.images?.length > 0 
    ? product.images.map((i: any) => i.url) 
    : [`https://placehold.co/1000x1200/ffe1e8/800000/png?text=${encodeURIComponent(product.name)}`];

  // Temporary mock specifications & prices since they might not be fully structured in DB yet
  const specs = product.specifications ? product.specifications.split('\n') : [
    `Material: Standard ${product.divisi.replace('_', ' ')} material`,
    `Quality: Premium Grade`
  ];
  
  const prices = [
    { qty: `${product.minOrder} - 24 pcs`, price: `Rp ${Number(product.price).toLocaleString('id-ID')} / pcs` },
    { qty: '25+ pcs', price: 'Contact Admin' }
  ];

  const handleWAOrder = () => {
    const text = encodeURIComponent(`Hello TOKRAF, I'm interested in ordering *${product.name}*. Can I get more information?`);
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  return (
    <div className="w-full bg-background min-h-screen pb-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Gallery Side - Sticky on desktop */}
          <div className="lg:sticky lg:top-32 h-fit">
            <motion.div 
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-secondary mb-6"
            >
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImg(idx)}
                  className={`shrink-0 w-24 h-32 rounded-xl overflow-hidden transition-all ${activeImg === idx ? 'ring-4 ring-primary' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Side */}
          <div className="pt-8">
            <Link to={`/layanan/${product.divisi.toLowerCase()}`} className="text-sm font-bold text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
              {product.divisi.replace('_', ' ')}
            </Link>
            <h1 className="text-5xl md:text-7xl font-extrabold font-heading text-foreground mt-4 mb-8 tracking-tighter leading-[0.9]">
              {product.name}
            </h1>
            <div className="text-4xl font-light text-foreground/80 mb-12 border-b border-border pb-12">
              From Rp {Number(product.price).toLocaleString('id-ID')}
            </div>
            
            <div className="prose prose-lg prose-p:text-foreground/70 prose-p:font-light max-w-none mb-12 whitespace-pre-line">
              <p>{product.description}</p>
            </div>

            <div className="mb-16">
              <h3 className="text-xl font-bold font-heading mb-6 uppercase tracking-widest text-primary">Specifications</h3>
              <ul className="space-y-4">
                {specs.map((spec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-4 text-foreground/80 font-light text-lg">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-secondary rounded-[2rem] p-10 mb-12">
              <h3 className="text-xl font-bold font-heading mb-6 text-foreground">Tier Pricing (Min. {product.minOrder} pcs)</h3>
              <div className="space-y-4">
                {prices.map((p: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-4 border-b border-primary/10 last:border-0">
                    <span className="text-lg font-light text-foreground/70">{p.qty}</span>
                    <span className="text-xl font-bold text-foreground">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-3 py-6 rounded-full font-heading font-bold text-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  addedToCart 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'bg-secondary border-border text-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {addedToCart ? <><CheckCircle size={26} /> Ditambahkan!</> : <><ShoppingBag size={26} /> Tambah ke Keranjang</>}
              </button>
              <button 
                onClick={handleWAOrder}
                className="w-full block text-center bg-primary text-white font-heading font-bold text-2xl py-6 rounded-full hover:bg-foreground hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Pesan via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
