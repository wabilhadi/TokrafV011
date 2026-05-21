import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

export default function Tentang() {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div className="w-full bg-background min-h-screen">
      
      {/* Parallax Header */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden rounded-b-[3rem] shadow-2xl mb-24">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img style={{ y: yBg, scale: 1.2 }} src="/assets/bg_tentang.png" className="w-full h-full object-cover origin-top" alt="Tentang Background" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[8rem] font-extrabold font-heading text-white tracking-tighter leading-none"
          >
            {t('tentang.ourStory')}
          </motion.h1>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24">
        
        {/* Content Section */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
              {t('tentang.heading')}
            </h2>
            <p className="text-2xl font-light text-foreground/80 leading-relaxed">
              {t('tentang.subheading')}
            </p>
            <div className="space-y-6 text-lg text-foreground/70 leading-relaxed font-light">
              <p>
                {t('tentang.p1')}
              </p>
              <p>
                {t('tentang.p2')}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-secondary/50 backdrop-blur-2xl border border-border/50 shadow-2xl p-10 md:p-16 rounded-[3rem]"
          >
            <h3 className="text-3xl font-heading font-bold text-foreground mb-10">{t('tentang.coreValues')}</h3>
            <div className="space-y-8">
              {[
                { num: "01", title: t('tentang.cv1Title'), desc: t('tentang.cv1Desc') },
                { num: "02", title: t('tentang.cv2Title'), desc: t('tentang.cv2Desc') },
                { num: "03", title: t('tentang.cv3Title'), desc: t('tentang.cv3Desc') },
              ].map((val) => (
                <div key={val.num} className="flex gap-6">
                  <span className="text-2xl font-heading font-bold text-primary shrink-0">{val.num}</span>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2">{val.title}</h4>
                    <p className="text-foreground/70">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
