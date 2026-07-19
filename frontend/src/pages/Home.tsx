import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
// Bestsellers fetched dynamically

// ─── Division data ─────────────────────────────────────────────────────────────
const DIVISIONS = [
  {
    num: '01',
    key: 'konveksi',
    href: '/layanan/konveksi',
    title: 'Tokraf Konveksi.',
    desc: 'Kaos, jaket, hoodie, polo, jersey, korsa — produksi custom berkualitas tinggi.',
    price: 'Mulai Rp 65.000',
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
    price: 'Mulai Rp 9.000',
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
    price: 'Mulai Rp 25.000',
    bg: 'from-[#5a1a1a] to-[#2d0d0d]',
    accent: '#ffc0c0',
    image: 'https://images.unsplash.com/photo-1563690623230-0322ba6db7d4?q=80&w=800',
  },
];

// ─── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: any; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 1.11, 0.81, 0.99] }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/produk/${product.id}`} className="block relative h-full flex flex-col group">
        <div className="relative w-full aspect-square overflow-hidden rounded-[1rem] bg-secondary/30 mb-3 shadow-sm group-hover:shadow-md transition-all duration-300">
          {product.imageUrl ? (
            <motion.img
              src={product.imageUrl.startsWith('http') ? product.imageUrl : `https://tokraf-backend.vercel.app${product.imageUrl}`}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-secondary text-foreground/30 font-medium text-xs">
              No Image
            </div>
          )}
          <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wider shadow-sm">
            Baru
          </div>
        </div>

        <div className="flex flex-col flex-grow px-1">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/70 mb-1 line-clamp-1">
            {product.divisi?.replace('_', ' ')}
          </p>
          <h3 className="text-sm md:text-base font-sans font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="text-base md:text-lg font-heading font-extrabold text-foreground mt-auto">
            Rp {product.price?.toLocaleString('id-ID')}
          </p>
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
          className={`relative rounded-[2rem] overflow-hidden bg-gradient-to-br ${div.bg} min-h-[220px] md:h-full md:min-h-[360px] flex flex-col justify-end p-5 md:p-6 cursor-pointer`}
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
          <div className="relative z-10 mt-6">
            <motion.h3
              className="text-2xl md:text-4xl font-extrabold text-white tracking-tighter leading-tight mb-3"
              animate={{ y: hovered ? -4 : 0 }}
              transition={{ duration: 0.35 }}
            >
              {div.title}
            </motion.h3>
            <motion.p
              className="text-white/70 text-sm md:text-base leading-relaxed mb-2 max-w-xs"
              animate={{ opacity: hovered ? 1 : 0.7 }}
              transition={{ duration: 0.3 }}
            >
              {div.desc}
            </motion.p>

            <motion.p
              className="text-white font-bold text-base mb-6"
              animate={{ opacity: hovered ? 1 : 0.9 }}
            >
              {div.price}
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
              Lihat Produk <ArrowRight size={14} />
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

  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://tokraf-backend.vercel.app/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBestsellers(data.slice(0, 4)); // Get 4 products for bestsellers
          setRecommended(data.filter((p: any) => p.isRecommended).slice(0, 4)); // Get 4 recommended products
        }
      })
      .catch(err => console.error('Failed to fetch products', err));
  }, []);

  return (
    <div className="w-full bg-background overflow-x-hidden font-sans">

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] w-full flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="relative z-10 text-center px-4 w-full max-w-[1200px] mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <h1 className="font-heading font-extrabold text-foreground leading-[1.1] tracking-tighter mb-6 text-[clamp(2.5rem,6vw,5rem)]">
              {t('home.heroTitlePart1')} <br className="md:hidden" /> <span className="text-primary">{t('home.heroTitlePart2')}</span>
            </h1>
            <p className="font-light text-foreground/80 max-w-2xl mx-auto tracking-tight mb-10 text-[clamp(1rem,2vw,1.25rem)] px-4">
              {t('home.heroSubtitle')}
            </p>
            <a
              href="#divisions"
              className="inline-flex items-center gap-4 text-primary font-heading font-bold text-lg md:text-xl uppercase tracking-widest hover:text-foreground transition-colors group"
            >
              {t('home.explore')} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-accent/20 rounded-full blur-[100px] md:blur-[150px] -z-10" />
      </section>

      {/* ── DIVISIONS — 3-column compact (Seed-style) ── */}
      <section id="divisions" className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-10 md:mb-16 text-center md:text-left"
          >
            <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-primary/70">Ekosistem Tokraf</span>
            <h2 className="font-heading font-extrabold text-foreground tracking-tighter mt-3 mb-4 md:mb-6 text-[clamp(2rem,4vw,3.5rem)] leading-tight">
              3 Divisi.<br className="hidden md:block" /> <span className="text-primary/40">Satu Atap.</span>
            </h2>
            <p className="text-foreground/60 max-w-2xl leading-relaxed mx-auto md:mx-0 text-[clamp(1rem,1.5vw,1.125rem)]">
              Semua kebutuhan produksi kreatifmu — dari pakaian custom hingga cetak banner — tersedia dalam satu platform.
            </p>
          </motion.div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {DIVISIONS.map((div, i) => (
              <DivisionCard key={div.key} div={div} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── REKOMENDASI PRODUK ── */}
      {recommended.length > 0 && (
        <section id="recommended" className="py-16 md:py-24 bg-card rounded-[2rem] mx-4 my-8 overflow-hidden border border-border/50">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6"
            >
              <div>
                <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-primary/70">Pilihan Admin</span>
                <h2 className="font-heading font-extrabold text-foreground tracking-tighter mt-2 text-[clamp(2rem,4vw,3.5rem)] leading-tight">
                  Rekomendasi<br className="hidden md:block" /> <span className="text-primary">Produk.</span>
                </h2>
              </div>
              <Link
                to="/layanan"
                className="self-start md:self-end inline-flex items-center gap-3 bg-secondary text-foreground font-heading font-bold px-6 py-3 md:px-8 md:py-4 rounded-full hover:bg-primary hover:text-white transition-all hover:scale-105 shadow-sm shrink-0"
              >
                Katalog Lengkap <ArrowRight size={18} />
              </Link>
            </motion.div>

            {/* Grid berubah otomatis: 2 di mobile, 3 di tablet, 4 di laptop, 5-6 di desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-6">
              {recommended.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PRODUK TERLARIS ── */}
      <section id="popular" className="py-16 md:py-24 bg-secondary rounded-[2rem] mx-4 my-8 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6"
          >
            <div>
              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-primary/70">Pilihan Populer</span>
              <h2 className="font-heading font-extrabold text-foreground tracking-tighter mt-2 text-[clamp(2rem,4vw,3.5rem)] leading-tight">
                Produk<br className="hidden md:block" /> <span className="text-primary">Terlaris.</span>
              </h2>
            </div>
            <Link
              to="/layanan"
              className="self-start md:self-end inline-flex items-center gap-3 bg-primary text-white font-heading font-bold px-6 py-3 md:px-8 md:py-4 rounded-full hover:bg-foreground transition-all hover:scale-105 shadow-lg shrink-0"
            >
              Lihat Semua <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Grid berubah otomatis: 2 di mobile, 3 di tablet, 4 di laptop, 5-6 di desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-6">
            {bestsellers.length === 0 ? (
              <div className="col-span-full text-center py-20 text-foreground/50 text-lg md:text-xl font-light">Belum ada produk.</div>
            ) : (
              bestsellers.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))
            )}
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-3 gap-2 md:gap-4 mt-12 md:mt-16 pt-8 border-t border-border"
          >
            {[
              { val: '100+', label: 'Klien Puas' },
              { val: '1 Thn', label: 'Pengalaman' },
              { val: '100%', label: 'Custom Made' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-4xl font-extrabold text-primary mb-1 md:mb-2">{s.val}</div>
                <div className="text-[10px] md:text-sm font-bold text-foreground/50 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CLIENT LOGOS ── */}
      <section className="py-12 border-y border-border/50 bg-secondary/30 overflow-hidden mb-4">
        <div className="max-w-[1400px] mx-auto px-6 text-center mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-foreground/50">Dipercaya oleh 500+ Klien & Organisasi</p>
        </div>
        <div className="flex gap-8 md:gap-12 items-center justify-center flex-wrap max-w-4xl mx-auto opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Dummy text for logos */}
          <span className="text-xl md:text-3xl font-bold font-heading tracking-tighter">UNU JOGJA</span>
          <span className="text-xl md:text-3xl font-bold font-heading tracking-tighter">PGSD UNU Jogja</span>
          <span className="text-xl md:text-3xl font-bold font-heading tracking-tighter">UIN SUKA</span>
          <span className="text-xl md:text-3xl font-bold font-heading tracking-tighter">BEM UCY</span>
          <span className="text-xl md:text-3xl font-bold font-heading tracking-tighter">AMIKOM YOGYA</span>
          <span className="text-xl md:text-3xl font-bold font-heading tracking-tighter">FARMASI UNU Jogja</span>
          <span className="text-xl md:text-3xl font-bold font-heading tracking-tighter">FTI UNU Jogja</span>
          <span className="text-xl md:text-3xl font-bold font-heading tracking-tighter">FE UNU Jogja</span>
          <span className="text-xl md:text-3xl font-bold font-heading tracking-tighter">FLORANCE UNU Jogja</span>
          <span className="text-xl md:text-3xl font-bold font-heading tracking-tighter">PERMASUM UNU Jogja</span>
          <span className="text-xl md:text-3xl font-bold font-heading tracking-tighter">Wo-Men In Tech Security</span>
          <span className="text-xl md:text-3xl font-bold font-heading tracking-tighter">++++</span>

        </div>
      </section>


      {/* ── TESTIMONI ── */}
      <section className="py-16 px-4 bg-secondary/30 mt-4 rounded-3xl mx-4">
        <div className="max-w-[1400px] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">Ulasan Klien</span>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tighter mt-2 mb-10">
            Kata <span className="text-primary">Mereka.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { name: 'Budi (Panitia Event)', review: 'Bikin kaos panitia di sini cepet banget dan hasilnya memuaskan. Sablonnya awet gak gampang pecah.' },
              { name: 'Siti (HIMA Kampus)', review: 'Pesen lanyard sama ID card buat maba. Kualitasnya juara, adminnya juga fast respon dan ramah.' },
              { name: 'Agus (Pemilik UMKM)', review: 'Cetak banner dan stiker kemasan selalu di Tokraf. Warnanya tajam dan harganya bersahabat buat UMKM.' },
            ].map((t, i) => (
              <div key={i} className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow">
                <div className="flex text-yellow-500 mb-4 gap-1">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6 italic">"{t.review}"</p>
                <div className="font-bold text-foreground font-heading tracking-wide">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 md:p-12 overflow-hidden mx-4 mb-16 md:mb-24 rounded-[2rem]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            style={{ y: yBgCTA, scale: 1.2 }}
            src="/assets/bg_cta.png"
            className="w-full h-full object-cover origin-center"
            alt="CTA Background"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-10 w-full max-w-[900px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[2rem] p-8 md:p-16 text-center overflow-hidden flex flex-col items-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
          <h2
            className="relative z-10 font-heading font-extrabold text-white tracking-tighter leading-tight mb-8 md:mb-10 text-[clamp(2rem,5vw,4.5rem)]"
            dangerouslySetInnerHTML={{ __html: t('home.startProject') }}
          />
          <a
            href="https://wa.me/6281993294170"
            target="_blank"
            rel="noreferrer"
            className="relative z-10 inline-flex justify-center items-center bg-white text-black text-base md:text-xl font-heading font-bold px-8 md:px-12 py-4 md:py-5 rounded-full hover:bg-primary hover:text-white hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            {t('home.contactAdmin')}
          </a>
        </motion.div>
      </section>

    </div>
  );
}
