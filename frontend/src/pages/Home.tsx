import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { TOKRAF_PRODUCTS } from '../lib/products';

// ─── Produk Terlaris (pilih dari katalog nyata) ───────────────────────────────
const BESTSELLERS = [
  { ...TOKRAF_PRODUCTS.find(p => p.id === 'k1')!, badge: 'Terlaris' },
  { ...TOKRAF_PRODUCTS.find(p => p.id === 'm4')!, badge: 'Favorit' },
  { ...TOKRAF_PRODUCTS.find(p => p.id === 'k4')!, badge: 'Hits' },
  { ...TOKRAF_PRODUCTS.find(p => p.id === 'm5')!, badge: 'New' },
  { ...TOKRAF_PRODUCTS.find(p => p.id === 'p1')!, badge: 'Promo' },
  { ...TOKRAF_PRODUCTS.find(p => p.id === 'k2')!, badge: 'Populer' },
];

// ─── Division data ─────────────────────────────────────────────────────────────
const DIVISIONS = [
  {
    num: '01',
    key: 'konveksi',
    href: '/layanan/konveksi',
    title: 'Tokraf Konveksi.',
    desc: 'Kaos, jaket, hoodie, polo, jersey, korsa — produksi custom berkualitas tinggi.',
    bg: 'from-[#800000] to-[#4a0000]',
    accent: '#ffd6d6',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
  },
  {
    num: '02',
    key: 'merch',
    href: '/layanan/merch',
    title: 'Tokraf Merch.',
    desc: 'Lanyard, mug, tumbler, ganci, ID card — merchandise event profesional.',
    bg: 'from-[#2d1a1a] to-[#1a0a0a]',
    accent: '#ffb3b3',
    image: 'https://images.unsplash.com/photo-1610943640030-22cba2bd11d3?q=80&w=800',
  },
  {
    num: '03',
    key: 'printing',
    href: '/layanan/digital-printing',
    title: 'Tokraf Print.',
    desc: 'Banner, spanduk, sticker, kartu nama, poster — cetak berkualitas ekspor.',
    bg: 'from-[#5a1a1a] to-[#2d0d0d]',
    accent: '#ffc0c0',
    image: 'https://images.unsplash.com/photo-1563690623230-0322ba6db7d4?q=80&w=800',
  },
];

// ─── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: typeof BESTSELLERS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/produk/${product.id}`} className="block group">
        <div
          className="relative rounded-[2rem] overflow-hidden bg-secondary border border-border transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:border-primary/30"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className="text-[11px] font-bold uppercase tracking-widest bg-primary text-white px-3 py-1.5 rounded-full shadow-md">
              {product.badge}
            </span>
          </div>

          {/* Arrow on hover */}
          <motion.div
            className="absolute top-4 right-4 z-20 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.25 }}
          >
            <ArrowUpRight size={16} className="text-foreground" />
          </motion.div>

          {/* Product image */}
          <div className="aspect-[3/4] overflow-hidden bg-background">
            <motion.img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* Info */}
          <div className="p-5 pb-6">
            {/* Category pill */}
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/70">
              {product.divisi.replace('_', ' ')}
            </span>

            {/* Name */}
            <h3 className="text-lg font-bold text-foreground mt-1 mb-1 leading-tight tracking-tight">
              {product.name}
            </h3>

            {/* Price row */}
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-[10px] text-foreground/40 block mb-0.5">Mulai dari</span>
                <span className="text-xl font-extrabold text-primary">
                  Rp {Number(product.price).toLocaleString('id-ID')}
                </span>
              </div>

              {/* Hover CTA */}
              <motion.div
                animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 8 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-bold text-primary flex items-center gap-1"
              >
                Pesan <ArrowRight size={14} />
              </motion.div>
            </div>

            {/* Min order */}
            {product.minOrder > 1 && (
              <p className="text-[11px] text-foreground/40 mt-2">Min. {product.minOrder} pcs</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Division Card (compact 3-column, Seed-inspired) ─────────────────────────
function DivisionCard({ div, index }: { div: typeof DIVISIONS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={div.href} className="block group">
        <div
          className={`relative rounded-[2rem] overflow-hidden bg-gradient-to-br ${div.bg} h-full min-h-[420px] flex flex-col justify-end p-8 cursor-pointer`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Background image with hover zoom */}
          <div className="absolute inset-0 z-0">
            <motion.img
              src={div.image}
              alt={div.title}
              className="w-full h-full object-cover mix-blend-overlay opacity-40"
              animate={{ scale: hovered ? 1.1 : 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>

          {/* Division number */}
          <div className="relative z-10 flex items-center gap-2 mb-auto pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">
              Division {div.num}
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 mt-8">
            <motion.h3
              className="text-3xl md:text-4xl font-extrabold text-white tracking-tighter leading-tight mb-3"
              animate={{ y: hovered ? -4 : 0 }}
              transition={{ duration: 0.35 }}
            >
              {div.title}
            </motion.h3>
            <motion.p
              className="text-white/70 text-sm leading-relaxed mb-6 max-w-xs"
              animate={{ opacity: hovered ? 1 : 0.7 }}
              transition={{ duration: 0.3 }}
            >
              {div.desc}
            </motion.p>

            {/* CTA button */}
            <motion.span
              className="inline-flex items-center gap-2 bg-white text-foreground font-bold text-sm px-5 py-2.5 rounded-full"
              animate={{
                backgroundColor: hovered ? '#800000' : '#ffffff',
                color: hovered ? '#ffffff' : '#0A0A0A',
                x: hovered ? 4 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              Explore <ArrowRight size={14} />
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Home() {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 0.3], [0, 120]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const yBgCTA = useTransform(scrollYProgress, [0, 1], ['-10%', '30%']);

  return (
    <div className="w-full bg-background overflow-x-hidden font-sans">

      {/* ── HERO ── */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl md:text-[9rem] font-heading font-extrabold text-foreground leading-[0.85] tracking-tighter mb-8">
              {t('home.heroTitlePart1')} <br /> <span className="text-primary">{t('home.heroTitlePart2')}</span>
            </h1>
            <p className="text-xl md:text-3xl font-light text-foreground/80 max-w-3xl mx-auto tracking-tight mb-12">
              {t('home.heroSubtitle')}
            </p>
            <a
              href="#divisions"
              className="inline-flex items-center gap-4 text-primary font-heading font-bold text-xl uppercase tracking-widest hover:text-foreground transition-colors group"
            >
              {t('home.explore')} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-accent/30 rounded-full blur-[120px] -z-10" />
      </section>

      {/* ── DIVISIONS — 3-column compact (Seed-style) ── */}
      <section id="divisions" className="py-24 px-4">
        <div className="max-w-[1400px] mx-auto">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">Ekosistem Tokraf</span>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tighter mt-3 mb-5">
              3 Divisi.<br /><span className="text-primary/40">Satu Atap.</span>
            </h2>
            <p className="text-foreground/60 text-xl max-w-lg leading-relaxed">
              Semua kebutuhan produksi kreatifmu — dari pakaian custom hingga cetak banner — tersedia dalam satu platform.
            </p>
          </motion.div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DIVISIONS.map((div, i) => (
              <DivisionCard key={div.key} div={div} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUK TERLARIS — Seed card style ── */}
      <section id="popular" className="py-24 bg-secondary rounded-[3rem] mx-4 my-4 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">Pilihan Populer</span>
              <h2 className="text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tighter mt-3">
                Produk<br /><span className="text-primary">Terlaris.</span>
              </h2>
            </div>
            <Link
              to="/layanan"
              className="self-start md:self-end inline-flex items-center gap-3 bg-primary text-white font-heading font-bold px-8 py-4 rounded-full hover:bg-foreground transition-all hover:scale-105 shadow-lg shrink-0"
            >
              Lihat Semua <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Product grid — 3 cols desktop, 2 cols tablet, 1 mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BESTSELLERS.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 mt-16 pt-12 border-t border-border"
          >
            {[
              { val: '500+', label: 'Klien Puas' },
              { val: '6 Thn', label: 'Pengalaman' },
              { val: '100%', label: 'Custom Made' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">{s.val}</div>
                <div className="text-sm font-bold text-foreground/50 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-40 bg-foreground text-background rounded-[3rem] mx-4 my-4">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-24"
          >
            <h2 className="text-5xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8 text-background">
              {t('home.theStandard')}
            </h2>
            <p className="text-3xl md:text-5xl font-light text-background/80 leading-tight max-w-5xl">
              {t('home.theStandardDesc')}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-16 border-t border-background/20 pt-16">
            {[
              { num: '01', title: t('home.whyUs1Title'), desc: t('home.whyUs1Desc') },
              { num: '02', title: t('home.whyUs2Title'), desc: t('home.whyUs2Desc') },
              { num: '03', title: t('home.whyUs3Title'), desc: t('home.whyUs3Desc') },
            ].map(item => (
              <div key={item.num}>
                <div className="text-6xl font-heading font-light text-primary mb-6">{item.num}</div>
                <h4 className="text-2xl font-bold font-heading mb-4 text-background">{item.title}</h4>
                <p className="text-background/70 text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative min-h-[80vh] flex items-center justify-center p-6 md:p-12 overflow-hidden mx-4 mb-24 rounded-[3rem]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            style={{ y: yBgCTA, scale: 1.2 }}
            src="/assets/bg_cta.png"
            className="w-full h-full object-cover origin-center"
            alt="CTA Background"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-10 w-full max-w-[1000px] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-[3rem] p-16 md:p-24 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
          <h2
            className="relative z-10 text-6xl md:text-[8rem] font-heading font-extrabold text-white tracking-tighter leading-[0.9] mb-12"
            dangerouslySetInnerHTML={{ __html: t('home.startProject') }}
          />
          <a
            href="https://wa.me/6281993294170"
            target="_blank"
            rel="noreferrer"
            className="relative z-10 inline-flex bg-white text-black text-2xl font-heading font-bold px-12 py-6 rounded-full hover:bg-primary hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl"
          >
            {t('home.contactAdmin')}
          </a>
        </motion.div>
      </section>

    </div>
  );
}
