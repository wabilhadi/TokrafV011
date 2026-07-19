import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import api from '../lib/api';

type Portfolio = {
  id: string;
  title: string;
  clientName?: string;
  divisi: string;
  images: { url: string }[];
};

// Mock fallback data
const MOCK_PORTFOLIO: Portfolio[] = [
  { id: '1', title: 'Kemeja PDH BEM', divisi: 'KONVEKSI', images: [{ url: 'https://placehold.co/800x600/ffe1e8/800000/png?text=PDH+BEM' }] },
  { id: '2', title: 'Totebag Seminar', divisi: 'MERCH', images: [{ url: 'https://placehold.co/800x600/ffe1e8/800000/png?text=Totebag' }] },
  { id: '3', title: 'X-Banner Event', divisi: 'DIGITAL_PRINTING', images: [{ url: 'https://placehold.co/800x600/ffe1e8/800000/png?text=X-Banner' }] },
  { id: '4', title: 'Jaket Angkatan', divisi: 'KONVEKSI', images: [{ url: 'https://placehold.co/800x600/ffe1e8/800000/png?text=Jaket' }] },
  { id: '5', title: 'Lanyard Custom', divisi: 'MERCH', images: [{ url: 'https://placehold.co/800x600/ffe1e8/800000/png?text=Lanyard' }] },
  { id: '6', title: 'Buku Panduan', divisi: 'DIGITAL_PRINTING', images: [{ url: 'https://placehold.co/800x600/ffe1e8/800000/png?text=Buku' }] },
];

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://tokraf-backend.vercel.app';

export default function Portofolio() {
  const [activeTab, setActiveTab] = useState('all');
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const tabs = [
    { id: 'all', label: t('layanan.everything') },
    { id: 'KONVEKSI', label: 'Konveksi' },
    { id: 'MERCH', label: 'Merchandise' },
    { id: 'DIGITAL_PRINTING', label: 'Printing' },
  ];

  useEffect(() => {
    api.get('/portfolio')
      .then(r => setPortfolios(r.data?.length > 0 ? r.data : MOCK_PORTFOLIO))
      .catch(() => setPortfolios(MOCK_PORTFOLIO))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'all' ? portfolios : portfolios.filter(p => p.divisi === activeTab);

  const resolveUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
  };

  return (
    <div className="w-full bg-background min-h-screen">

      {/* Parallax Header */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col items-start justify-end pb-16 pt-32 overflow-hidden rounded-b-[2rem] md:rounded-b-[3rem] shadow-xl md:shadow-2xl mb-16 md:mb-24">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img style={{ y: yBg, scale: 1.2 }} src="/assets/bg_portofolio.png" className="w-full h-full object-cover origin-top" alt="Portofolio" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-black/20" />
        </div>
        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 md:px-8 mt-12 md:mt-32">
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            className="font-extrabold font-heading text-white tracking-tighter leading-tight mb-4 md:mb-8 text-[clamp(2.5rem,5vw,5rem)]">
            {t('portofolio.gallery')}
          </motion.h1>
          <p className="font-light text-white/80 max-w-2xl text-[clamp(1rem,2vw,1.5rem)]">{t('portofolio.galleryDesc')}</p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-16 md:pb-24">
        {/* Filter Tabs */}
        <div className="mb-8 md:mb-12 flex flex-wrap gap-2 md:gap-4">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 md:px-8 md:py-4 rounded-full font-heading font-bold text-sm md:text-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md md:shadow-xl md:scale-105'
                  : 'bg-secondary text-foreground hover:bg-foreground hover:text-background'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-[2rem] overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-6 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <motion.div layout key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/5 backdrop-blur-xl border border-border/30 p-4 rounded-[2rem] group"
                >
                  <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-secondary mb-6">
                    <img
                      src={resolveUrl(item.images?.[0]?.url)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="px-4 pb-4">
                    <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">
                      {item.divisi.replace('_', ' ')}
                    </span>
                    <h3 className="text-2xl font-bold font-heading text-foreground">{item.title}</h3>
                    {item.clientName && <p className="text-sm text-foreground/50 mt-1">{item.clientName}</p>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTA */}
        <div className="mt-32 text-center bg-secondary/50 backdrop-blur-3xl border border-border/50 rounded-[3rem] p-16 md:p-24 relative overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-8 relative z-10">
            {t('portofolio.wantBrandHere')}
          </h2>
          <Link to="/kontak"
            className="inline-flex items-center gap-3 bg-primary text-background px-10 py-5 rounded-full font-heading font-bold text-xl hover:scale-105 transition-all relative z-10 shadow-2xl">
            {t('portofolio.startProject')} <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
