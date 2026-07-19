import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

// ── Division data ──────────────────────────────────────────────────────────────
const DIVISIONS = [
  {
    num: '01',
    key: 'konveksi',
    href: '/layanan/konveksi',
    title: 'Tokraf Konveksi',
    desc: 'Kaos, jaket, hoodie, polo, jersey, korsa — produksi custom berkualitas.',
    price: 'Mulai Rp 65.000',
    bg: 'from-[#800000] to-[#4a0000]',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
  },
  {
    num: '02',
    key: 'merch',
    href: '/layanan/merch',
    title: 'Tokraf Merch',
    desc: 'Lanyard, mug, tumbler, ganci, ID card — merchandise event profesional.',
    price: 'Mulai Rp 9.000',
    bg: 'from-[#2d1a1a] to-[#1a0a0a]',
    image: 'https://images.unsplash.com/photo-1610943640030-22cba2bd11d3?q=80&w=800',
  },
  {
    num: '03',
    key: 'printing',
    href: '/layanan/digital-printing',
    title: 'Tokraf Print',
    desc: 'Banner, spanduk, sticker, kartu nama, poster — cetak berkualitas ekspor.',
    price: 'Mulai Rp 25.000',
    bg: 'from-[#5a1a1a] to-[#2d0d0d]',
    image: 'https://images.unsplash.com/photo-1563690623230-0322ba6db7d4?q=80&w=800',
  },
];

// ── Product Card ── Shopee-style compact card
function ProductCard({ product, index }: { product: any; index: number }) {
  const imgSrc = product.imageUrl
    ? (product.imageUrl.startsWith('http')
      ? product.imageUrl
      : `https://tokraf-backend.vercel.app${product.imageUrl}`)
    : null;

  return (
    <Link
      to={`/produk/${product.id}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-card border border-border/40 shadow-sm active:scale-[0.98] transition-transform"
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-secondary/30">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-foreground/30 text-xs">No Image</div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 md:p-3 flex flex-col flex-grow">
        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-0.5 leading-none truncate">
          {product.divisi?.replace('_', ' ')}
        </p>
        <h3 className="text-xs md:text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm md:text-base font-extrabold text-primary mt-auto font-heading">
          Rp {product.price?.toLocaleString('id-ID')}
        </p>
      </div>
    </Link>
  );
}

// ── Division Card ── horizontal compact card for mobile
function DivisionCard({ div, index }: { div: typeof DIVISIONS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <Link to={div.href} className="block group">
        <div
          className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${div.bg} 
            h-[160px] md:h-[280px] lg:h-[360px]
            flex flex-col justify-end p-4 md:p-6 cursor-pointer`}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={div.image}
              alt={div.title}
              className="w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
              Div {div.num}
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-lg md:text-3xl font-extrabold text-white tracking-tight leading-none mb-1 md:mb-2">
              {div.title}
            </h3>
            <p className="text-white/70 text-xs md:text-sm leading-relaxed hidden md:block mb-3">
              {div.desc}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white/90 font-bold text-sm">{div.price}</span>
              <span className="inline-flex items-center gap-1 bg-white/20 hover:bg-white text-white hover:text-foreground text-xs font-bold px-3 py-1.5 rounded-full transition-all">
                Lihat <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────────
export default function Home() {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const yBgCTA = useTransform(scrollYProgress, [0, 1], ['-5%', '20%']);

  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://tokraf-backend.vercel.app/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBestsellers(data.slice(0, 6));
          setRecommended(data.filter((p: any) => p.isRecommended).slice(0, 6));
        }
      })
      .catch(err => console.error('Failed to fetch products', err));
  }, []);

  return (
    <div className="w-full bg-background overflow-x-hidden">

      {/* ─────── HERO ─────── */}
      <section className="relative flex flex-col items-center justify-center text-center overflow-hidden
        min-h-[55vw] md:min-h-[70vh]
        pt-10 pb-8 md:pt-20 md:pb-16
        px-5">

        {/* Ambient glow */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[90vw] h-[90vw] md:w-[50vw] md:h-[50vw] bg-accent/25 rounded-full blur-[60px] md:blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl w-full mx-auto"
        >
          {/* Eyebrow */}
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-primary/60 mb-3">
            One Stop Creative Solution
          </p>

          <h1 className="font-heading font-extrabold text-foreground leading-[1.05] tracking-tighter mb-3 md:mb-5
            text-[clamp(2.4rem,9vw,5rem)]">
            {t('home.heroTitlePart1')}
            <br className="md:hidden" />
            {' '}<span className="text-primary">{t('home.heroTitlePart2')}</span>
          </h1>

          <p className="text-foreground/70 leading-relaxed
            text-[clamp(0.875rem,3vw,1.125rem)] max-w-md mx-auto">
            {t('home.heroSubtitle')}
          </p>
        </motion.div>
      </section>

      {/* ─────── DIVISIONS ─────── */}
      <section id="divisions" className="section-px section-py">
        <div className="section-container">
          {/* Header */}
          <div className="mb-5 md:mb-10">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary/60 mb-1">
              Ekosistem Tokraf
            </p>
            <h2 className="text-[clamp(1.6rem,5vw,3rem)] font-extrabold text-foreground tracking-tight leading-tight">
              3 Divisi. <span className="text-primary/50">Satu Atap.</span>
            </h2>
          </div>

          {/* Grid: 1 col mobile → 3 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {DIVISIONS.map((div, i) => (
              <DivisionCard key={div.key} div={div} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────── REKOMENDASI PRODUK ─────── */}
      {recommended.length > 0 && (
        <section className="section-px py-6 md:py-16 bg-secondary/40">
          <div className="section-container">
            <div className="flex items-end justify-between mb-4 md:mb-8">
              <div>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary/60 mb-0.5">Pilihan Admin</p>
                <h2 className="text-[clamp(1.4rem,4vw,2.5rem)] font-extrabold text-foreground tracking-tight leading-none">
                  Rekomendasi
                </h2>
              </div>
              <Link
                to="/layanan"
                className="text-xs md:text-sm font-bold text-primary hover:underline whitespace-nowrap flex items-center gap-1"
              >
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 md:gap-4">
              {recommended.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────── PRODUK TERLARIS ─────── */}
      <section id="popular" className="section-px py-6 md:py-16">
        <div className="section-container">
          <div className="flex items-end justify-between mb-4 md:mb-8">
            <div>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary/60 mb-0.5">Pilihan Populer</p>
              <h2 className="text-[clamp(1.4rem,4vw,2.5rem)] font-extrabold text-foreground tracking-tight leading-none">
                Produk Terlaris
              </h2>
            </div>
            <Link
              to="/layanan"
              className="text-xs md:text-sm font-bold text-primary hover:underline whitespace-nowrap flex items-center gap-1"
            >
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 md:gap-4">
            {bestsellers.length === 0 ? (
              <div className="col-span-full text-center py-12 text-foreground/40 text-sm">Belum ada produk.</div>
            ) : (
              bestsellers.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-border">
            {[
              { val: '100+', label: 'Klien Puas' },
              { val: '1 Thn', label: 'Pengalaman' },
              { val: '100%', label: 'Custom Made' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xl md:text-3xl font-extrabold text-primary mb-0.5">{s.val}</div>
                <div className="text-[10px] md:text-xs font-semibold text-foreground/50 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── CLIENT LOGOS ─────── */}
      <section className="py-8 md:py-14 border-y border-border/50 bg-secondary/20 overflow-hidden">
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-foreground/40 text-center mb-5">
          Dipercaya 100+ Klien &amp; Organisasi
        </p>
        <div className="flex gap-5 md:gap-10 items-center justify-center flex-wrap max-w-3xl mx-auto px-4 opacity-50">
          {['UNU JOGJA', 'PGSD UNU', 'UIN SUKA', 'BEM UCY', 'AMIKOM', 'FTI UNU', 'FE UNU'].map(n => (
            <span key={n} className="text-sm md:text-xl font-extrabold font-heading tracking-tighter">{n}</span>
          ))}
        </div>
      </section>

      {/* ─────── TESTIMONI ─────── */}
      <section className="section-px py-8 md:py-16">
        <div className="section-container">
          <div className="text-center mb-6 md:mb-10">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary/60 mb-1">Ulasan Klien</p>
            <h2 className="text-[clamp(1.6rem,5vw,3rem)] font-extrabold text-foreground tracking-tight">
              Kata <span className="text-primary">Mereka.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Budi (Panitia Event)', review: 'Bikin kaos panitia di sini cepet banget dan hasilnya memuaskan. Sablonnya awet gak gampang pecah.' },
              { name: 'Siti (HIMA Kampus)', review: 'Pesen lanyard sama ID card buat maba. Kualitasnya juara, adminnya juga fast respon dan ramah.' },
              { name: 'Agus (Pemilik UMKM)', review: 'Cetak banner dan stiker kemasan selalu di Tokraf. Warnanya tajam dan harganya bersahabat buat UMKM.' },
            ].map((review, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 md:p-6">
                <div className="flex text-yellow-400 mb-3 gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed mb-4 italic">"{review.review}"</p>
                <p className="font-bold text-foreground text-sm font-heading">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── CTA ─────── */}
      <section className="section-px py-6 md:py-16 mb-16 md:mb-24">
        <div className="section-container">
          <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden min-h-[220px] md:min-h-[400px] flex items-center justify-center p-6 md:p-16">
            {/* BG */}
            <motion.img
              style={{ y: yBgCTA }}
              src="/assets/bg_cta.png"
              className="absolute inset-0 w-full h-full object-cover scale-110"
              alt="CTA Background"
            />
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 text-center max-w-lg mx-auto">
              <h2
                className="font-heading font-extrabold text-white tracking-tight leading-tight mb-4 md:mb-6
                  text-[clamp(1.6rem,5vw,3.5rem)]"
                dangerouslySetInnerHTML={{ __html: t('home.startProject') }}
              />
              <a
                href="https://wa.me/6281993294170"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white text-black text-sm md:text-base font-heading font-bold
                  px-7 py-3 md:px-10 md:py-4 rounded-full
                  hover:bg-primary hover:text-white active:scale-95 transition-all shadow-xl"
              >
                {t('home.contactAdmin')} <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
