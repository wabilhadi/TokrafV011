import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

// Mock data (TODO: Connect to backend later)
const mockPortofolio = [
  { id: 1, title: 'Kemeja PDH BEM', category: 'konveksi', img: 'https://placehold.co/800x600/ffe1e8/800000/png?text=PDH+BEM' },
  { id: 2, title: 'Totebag Seminar', category: 'merch', img: 'https://placehold.co/800x600/ffe1e8/800000/png?text=Totebag' },
  { id: 3, title: 'X-Banner Event', category: 'digital-printing', img: 'https://placehold.co/800x600/ffe1e8/800000/png?text=X-Banner' },
  { id: 4, title: 'Jaket Angkatan', category: 'konveksi', img: 'https://placehold.co/800x600/ffe1e8/800000/png?text=Jaket' },
  { id: 5, title: 'Lanyard Custom', category: 'merch', img: 'https://placehold.co/800x600/ffe1e8/800000/png?text=Lanyard' },
  { id: 6, title: 'Buku Panduan', category: 'digital-printing', img: 'https://placehold.co/800x600/ffe1e8/800000/png?text=Buku' },
];

export default function Portofolio() {
  const [activeTab, setActiveTab] = useState('all');
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const tabs = [
    { id: 'all', label: t('layanan.everything') },
    { id: 'konveksi', label: 'Konveksi' },
    { id: 'merch', label: 'Merchandise' },
    { id: 'digital-printing', label: 'Printing' },
  ];

  const filtered = activeTab === 'all' ? mockPortofolio : mockPortofolio.filter(p => p.category === activeTab);

  return (
    <div className="w-full bg-background min-h-screen">
      
      {/* Parallax Header */}
      <section className="relative min-h-[60vh] flex items-end pb-24 overflow-hidden rounded-b-[3rem] shadow-2xl mb-24">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img style={{ y: yBg, scale: 1.2 }} src="/assets/bg_portofolio.png" className="w-full h-full object-cover origin-top" alt="Portofolio Background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-black/20"></div>
        </div>
        
        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 mt-32">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[8rem] font-extrabold font-heading text-white tracking-tighter leading-none mb-8"
          >
            {t('portofolio.gallery')}
          </motion.h1>
          <p className="text-2xl font-light text-white/80 max-w-2xl">
            {t('portofolio.galleryDesc')}
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24">
        <div className="mb-12">
          <div className="flex flex-wrap gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 rounded-full font-heading font-bold text-lg transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground shadow-xl scale-105' 
                    : 'bg-secondary text-foreground hover:bg-foreground hover:text-background'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filtered.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="bg-white/5 backdrop-blur-xl border border-border/30 p-4 rounded-[2rem] group"
              >
                <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-secondary mb-6">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="px-4 pb-4">
                  <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">{item.category.replace('-', ' ')}</span>
                  <h3 className="text-2xl font-bold font-heading text-foreground">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <div className="mt-32 text-center bg-secondary/50 backdrop-blur-3xl border border-border/50 rounded-[3rem] p-16 md:p-24 relative overflow-hidden">
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-8 relative z-10">{t('portofolio.wantBrandHere')}</h2>
          <Link to="/kontak" className="inline-flex items-center gap-3 bg-primary text-background px-10 py-5 rounded-full font-heading font-bold text-xl hover:scale-105 transition-all relative z-10 shadow-2xl">
            {t('portofolio.startProject')} <ArrowRight />
          </Link>
        </div>

      </div>
    </div>
  );
}
