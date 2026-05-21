import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function Kontak() {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div className="w-full bg-background min-h-screen">
      
      {/* Parallax Header */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden rounded-b-[3rem] shadow-2xl mb-24">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img style={{ y: yBg, scale: 1.2 }} src="/assets/bg_kontak.png" className="w-full h-full object-cover origin-top" alt="Kontak Background" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 mt-20">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[8rem] font-extrabold font-heading text-white tracking-tighter leading-none"
          >
            {t('kontak.letsTalk')}
          </motion.h1>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-24">

          {/* Contact Info */}
          <div>
            <h2 className="text-4xl font-heading font-bold text-foreground mb-12">{t('kontak.reachOut')}</h2>

            <div className="space-y-12">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="flex items-start gap-6 group">
                <div className="w-16 h-16 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-background transition-colors">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold font-heading text-foreground mb-2">WhatsApp</h4>
                  <p className="text-2xl font-light text-foreground/70">+62 819-9329-4170 </p>
                </div>
              </a>

              <a href="mailto:ekrafhimatika@gmail.com" className="flex items-start gap-6 group">
                <div className="w-16 h-16 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-background transition-colors">
                  <Mail size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold font-heading text-foreground mb-2">Email</h4>
                  <p className="text-2xl font-light text-foreground/70">ekrafhimatika@gmail.com</p>
                </div>
              </a>

              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold font-heading text-foreground mb-2">{t('kontak.office')}</h4>
                  <p className="text-xl font-light text-foreground/70 max-w-xs leading-relaxed">
                    {t('kontak.address')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-secondary/70 backdrop-blur-2xl border border-border/50 shadow-2xl p-10 md:p-16 rounded-[3rem]">
            <h3 className="text-3xl font-heading font-bold text-foreground mb-10">{t('kontak.sendMessage')}</h3>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold tracking-widest uppercase text-primary/60 mb-3">{t('kontak.name')}</label>
                <input type="text" className="w-full bg-transparent border-b-2 border-primary/20 pb-4 text-xl text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold tracking-widest uppercase text-primary/60 mb-3">{t('kontak.email')}</label>
                <input type="email" className="w-full bg-transparent border-b-2 border-primary/20 pb-4 text-xl text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold tracking-widest uppercase text-primary/60 mb-3">{t('kontak.message')}</label>
                <textarea rows={4} className="w-full bg-transparent border-b-2 border-primary/20 pb-4 text-xl text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary transition-colors resize-none" placeholder={t('kontak.messagePlaceholder')}></textarea>
              </div>
              <button className="w-full bg-primary text-background font-heading font-bold text-xl py-6 rounded-full hover:bg-foreground hover:text-background transition-all flex justify-center items-center gap-3">
                {t('kontak.sendBtn')} <ArrowRight size={24} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
