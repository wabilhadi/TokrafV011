import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

export default function Home() {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  // Parallax for Ecosystem Backgrounds
  const yBg1 = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const yBg2 = useTransform(scrollYProgress, [0, 1], ['-15%', '25%']);
  const yBg3 = useTransform(scrollYProgress, [0, 1], ['-25%', '15%']);
  const yBgCTA = useTransform(scrollYProgress, [0, 1], ['-10%', '30%']);

  return (
    <div className="w-full bg-background overflow-x-hidden font-sans">
      
      {/* HERO SECTION - Full Screen, Seed style */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: yHero, opacity: opacityHero }}
          className="relative z-10 text-center px-6"
        >
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl md:text-[9rem] font-heading font-extrabold text-foreground leading-[0.85] tracking-tighter mb-8">
              {t('home.heroTitlePart1')} <br/> <span className="text-primary">{t('home.heroTitlePart2')}</span>
            </h1>
            <p className="text-xl md:text-3xl font-light text-foreground/80 max-w-3xl mx-auto tracking-tight mb-12">
              {t('home.heroSubtitle')}
            </p>
            <a 
              href="#popular"
              className="inline-flex items-center gap-4 text-primary font-heading font-bold text-xl uppercase tracking-widest hover:text-foreground transition-colors group"
            >
              {t('home.explore')} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
        
        {/* Soft Pink Background Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-accent/30 rounded-full blur-[120px] -z-10"></div>
      </section>

      {/* POPULAR CATALOG - Seed style layout */}
      <section id="popular" className="bg-secondary rounded-[3rem] mx-4 my-8 p-8 md:p-16 lg:p-24 overflow-hidden relative">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Text */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <span className="inline-block bg-primary/10 text-primary font-bold px-4 py-2 rounded-full mb-6">{t('home.popularTag')}</span>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold text-foreground leading-[1.1] mb-8 tracking-tight">
              {t('home.popularTitle')}
            </h2>
            <p className="text-xl md:text-2xl font-light text-foreground/70 mb-10 leading-relaxed max-w-xl">
              {t('home.popularDesc')}
            </p>
            <Link to="/layanan" className="inline-flex bg-primary text-background font-heading font-bold text-xl px-10 py-5 rounded-full hover:bg-foreground hover:text-background transition-all hover:scale-105 shadow-xl">
              {t('home.shopAll')}
            </Link>
          </motion.div>

          {/* Right Side: Bento Grid Images */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-3 gap-4 md:gap-6 h-full relative z-10"
          >
            <div className="col-span-3 aspect-[4/3] md:aspect-[16/9] rounded-[2rem] overflow-hidden group bg-background shadow-md">
              <img src="/assets/catalog_main.png" alt="Popular Apparel" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="col-span-1 aspect-square rounded-[1.5rem] overflow-hidden group bg-background shadow-md">
              <img src="/assets/catalog_pin.png" alt="Enamel Pin" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="col-span-1 aspect-square rounded-[1.5rem] overflow-hidden group bg-background shadow-md">
              <img src="/assets/catalog_stickers.png" alt="Premium Stickers" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="col-span-1 aspect-square rounded-[1.5rem] overflow-hidden group bg-background shadow-md">
              <img src="/assets/catalog_totebag.png" alt="Canvas Totebag" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* THE DIVISIONS - SEED STYLE FULL WIDTH GLASS CARDS */}
      <section id="explore" className="relative bg-background flex flex-col gap-4 py-4">
        
        {/* Konveksi */}
        <div className="relative min-h-[80vh] flex items-center justify-center p-6 md:p-12 overflow-hidden mx-4 rounded-[3rem]">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.img style={{ y: yBg1, scale: 1.2 }} src="/assets/bg_konveksi.png" className="w-full h-full object-cover origin-center" alt="Konveksi Background" />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-[1300px] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-[3rem] p-10 md:p-20 overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span className="text-white text-sm font-bold uppercase tracking-widest">{t('home.div01')}</span>
                </div>
                <h3 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 tracking-tighter">{t('home.konveksiTitle')}</h3>
                <p className="text-xl md:text-3xl text-white/90 font-light mb-12 leading-relaxed">
                  {t('home.konveksiDesc')}
                </p>
                <Link to="/layanan/konveksi" className="inline-block bg-white text-black font-heading font-bold text-lg px-8 py-4 rounded-full hover:bg-black hover:text-white transition-all hover:scale-105">
                  {t('home.exploreKonveksi')}
                </Link>
              </div>
              <div className="aspect-square bg-black/10 backdrop-blur-md rounded-[2.5rem] border border-white/10 flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
                 <span className="text-white/60 font-heading text-2xl group-hover:scale-110 transition-transform duration-500">[ Konveksi Product Shot ]</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Merchandise */}
        <div className="relative min-h-[80vh] flex items-center justify-center p-6 md:p-12 overflow-hidden mx-4 rounded-[3rem]">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.img style={{ y: yBg2, scale: 1.2 }} src="/assets/bg_merch.png" className="w-full h-full object-cover origin-center" alt="Merchandise Background" />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-[1300px] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-[3rem] p-10 md:p-20 overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 aspect-square bg-black/10 backdrop-blur-md rounded-[2.5rem] border border-white/10 flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tl from-white/5 to-transparent"></div>
                 <span className="text-white/60 font-heading text-2xl group-hover:scale-110 transition-transform duration-500">[ Merchandise Shot ]</span>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span className="text-white text-sm font-bold uppercase tracking-widest">{t('home.div02')}</span>
                </div>
                <h3 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 tracking-tighter">{t('home.merchTitle')}</h3>
                <p className="text-xl md:text-3xl text-white/90 font-light mb-12 leading-relaxed">
                  {t('home.merchDesc')}
                </p>
                <Link to="/layanan/merch" className="inline-block bg-white text-black font-heading font-bold text-lg px-8 py-4 rounded-full hover:bg-black hover:text-white transition-all hover:scale-105">
                  {t('home.exploreMerch')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Digital Printing */}
        <div className="relative min-h-[80vh] flex items-center justify-center p-6 md:p-12 overflow-hidden mx-4 rounded-[3rem]">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.img style={{ y: yBg3, scale: 1.2 }} src="/assets/bg_printing.png" className="w-full h-full object-cover origin-center" alt="Printing Background" />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-[1300px] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-[3rem] p-10 md:p-20 overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span className="text-white text-sm font-bold uppercase tracking-widest">{t('home.div03')}</span>
                </div>
                <h3 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 tracking-tighter">{t('home.printTitle')}</h3>
                <p className="text-xl md:text-3xl text-white/90 font-light mb-12 leading-relaxed">
                  {t('home.printDesc')}
                </p>
                <Link to="/layanan/digital-printing" className="inline-block bg-white text-black font-heading font-bold text-lg px-8 py-4 rounded-full hover:bg-black hover:text-white transition-all hover:scale-105">
                  {t('home.explorePrint')}
                </Link>
              </div>
              <div className="aspect-square bg-black/10 backdrop-blur-md rounded-[2.5rem] border border-white/10 flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
                 <span className="text-white/60 font-heading text-2xl group-hover:scale-110 transition-transform duration-500">[ Print Product Shot ]</span>
              </div>
            </div>
          </motion.div>
        </div>

      </section>

      {/* WHY US - Seed large typography style */}
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
              { num: "01", title: t('home.whyUs1Title'), desc: t('home.whyUs1Desc') },
              { num: "02", title: t('home.whyUs2Title'), desc: t('home.whyUs2Desc') },
              { num: "03", title: t('home.whyUs3Title'), desc: t('home.whyUs3Desc') }
            ].map((item) => (
              <div key={item.num}>
                <div className="text-6xl font-heading font-light text-primary mb-6">{item.num}</div>
                <h4 className="text-2xl font-bold font-heading mb-4 text-background">{item.title}</h4>
                <p className="text-background/70 text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION - Massive, full bleed with strong Glassmorphism */}
      <section className="relative min-h-[80vh] flex items-center justify-center p-6 md:p-12 overflow-hidden mx-4 mb-24 rounded-[3rem]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img style={{ y: yBgCTA, scale: 1.2 }} src="/assets/bg_cta.png" className="w-full h-full object-cover origin-center" alt="CTA Background" />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
          className="relative z-10 w-full max-w-[1000px] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-[3rem] p-16 md:p-24 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
          <h2 className="relative z-10 text-6xl md:text-[8rem] font-heading font-extrabold text-white tracking-tighter leading-[0.9] mb-12" dangerouslySetInnerHTML={{ __html: t('home.startProject') }} />
          <a 
            href="https://wa.me/6281234567890" 
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
