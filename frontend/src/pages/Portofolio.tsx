import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import api from '../lib/api';

type Portfolio = {
  id: string;
  title: string;
  clientName?: string;
  divisi: string;
  images: { url: string }[];
};

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

  const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'KONVEKSI', label: 'Konveksi' },
    { id: 'MERCH', label: 'Merch' },
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
    <div className="w-full bg-background min-h-screen overflow-x-hidden">

      {/* ── Hero banner ── */}
      <div className="relative h-[200px] md:h-[360px] overflow-hidden">
        <img
          src="/assets/bg_portofolio.png"
          alt="Portofolio Tokraf"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="relative z-10 h-full flex flex-col justify-end px-5 pb-6 md:pb-10 md:px-12">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-extrabold font-heading text-white text-[clamp(2rem,6vw,4.5rem)] tracking-tight leading-none mb-1"
          >
            {t('portofolio.gallery')}
          </motion.h1>
          <p className="text-white/70 text-sm md:text-lg">{t('portofolio.galleryDesc')}</p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="section-px py-5 pb-16">
        <div className="section-container">

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-4 py-2 rounded-full font-heading font-bold text-xs md:text-sm transition-all
                  ${activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-secondary/60 text-foreground hover:bg-secondary'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Gallery */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-border animate-pulse">
                  <div className="aspect-[4/3] bg-secondary/50" />
                  <div className="p-3 space-y-2">
                    <div className="h-2.5 bg-secondary/50 rounded w-1/3" />
                    <div className="h-3.5 bg-secondary/50 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group rounded-2xl overflow-hidden border border-border/40 bg-card shadow-sm"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
                      <img
                        src={resolveUrl(item.images?.[0]?.url)}
                        alt={item.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <span className="text-primary text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-0.5 block">
                        {item.divisi.replace('_', ' ')}
                      </span>
                      <h3 className="text-xs md:text-sm font-bold font-heading text-foreground leading-snug line-clamp-2">{item.title}</h3>
                      {item.clientName && <p className="text-[10px] text-foreground/40 mt-0.5">{item.clientName}</p>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* CTA */}
          <div className="mt-10 md:mt-16 text-center bg-secondary/40 border border-border/30 rounded-2xl p-7 md:p-14">
            <h2 className="text-xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {t('portofolio.wantBrandHere')}
            </h2>
            <Link
              to="/kontak"
              className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-heading font-bold text-sm md:text-lg hover:opacity-90 active:scale-95 transition-all shadow-lg"
            >
              {t('portofolio.startProject')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
