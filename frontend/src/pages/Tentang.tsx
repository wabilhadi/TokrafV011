import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

export default function Tentang() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-background min-h-screen overflow-x-hidden">

      {/* ── Hero banner ── */}
      <div className="relative h-[220px] md:h-[380px] overflow-hidden">
        <img
          src="/assets/bg_tentang.png"
          alt="Tentang Tokraf"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full flex flex-col justify-end px-5 pb-6 md:pb-10 md:px-12">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-extrabold font-heading text-white text-[clamp(2rem,6vw,4.5rem)] tracking-tight leading-none"
          >
            {t('tentang.ourStory')}
          </motion.h1>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="section-px py-8 md:py-16">
        <div className="section-container">

          {/* Two-col grid on desktop */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 mb-12 md:mb-20">

            {/* Left: story */}
            <div className="space-y-5">
              <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-heading font-bold text-foreground leading-tight">
                {t('tentang.heading')}
              </h2>
              <p className="text-base md:text-xl font-light text-foreground/70 leading-relaxed">
                {t('tentang.subheading')}
              </p>
              <div className="space-y-4 text-sm md:text-base text-foreground/60 leading-relaxed">
                <p>{t('tentang.p1')}</p>
                <p>{t('tentang.p2')}</p>
              </div>
            </div>

            {/* Right: core values */}
            <div className="bg-secondary/40 border border-border/30 rounded-2xl md:rounded-3xl p-6 md:p-10">
              <h3 className="text-lg md:text-2xl font-heading font-bold text-foreground mb-6">
                {t('tentang.coreValues')}
              </h3>
              <div className="space-y-5">
                {[
                  { num: '01', title: t('tentang.cv1Title'), desc: t('tentang.cv1Desc') },
                  { num: '02', title: t('tentang.cv2Title'), desc: t('tentang.cv2Desc') },
                  { num: '03', title: t('tentang.cv3Title'), desc: t('tentang.cv3Desc') },
                ].map((val) => (
                  <div key={val.num} className="flex gap-4 pb-5 border-b border-border/30 last:border-0 last:pb-0">
                    <span className="text-xl font-heading font-extrabold text-primary shrink-0">{val.num}</span>
                    <div>
                      <h4 className="font-bold text-foreground mb-1 text-sm md:text-base">{val.title}</h4>
                      <p className="text-foreground/60 text-xs md:text-sm leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Why Us section */}
          <div className="bg-foreground text-background rounded-2xl md:rounded-3xl p-6 md:p-14">
            <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-heading font-extrabold tracking-tight mb-4 md:mb-6">
              {t('home.theStandard')}
            </h2>
            <p className="text-base md:text-xl font-light text-background/70 leading-relaxed mb-8 md:mb-10 max-w-3xl">
              {t('home.theStandardDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 border-t border-background/20 pt-6 md:pt-10">
              {[
                { num: '01', title: t('home.whyUs1Title'), desc: t('home.whyUs1Desc') },
                { num: '02', title: t('home.whyUs2Title'), desc: t('home.whyUs2Desc') },
                { num: '03', title: t('home.whyUs3Title'), desc: t('home.whyUs3Desc') },
              ].map(item => (
                <div key={item.num}>
                  <div className="text-2xl md:text-3xl font-heading font-light text-primary mb-3">{item.num}</div>
                  <h4 className="text-base md:text-xl font-bold font-heading mb-2 text-background">{item.title}</h4>
                  <p className="text-background/60 text-sm md:text-base leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
