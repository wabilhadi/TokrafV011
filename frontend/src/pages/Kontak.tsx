import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, MapPin, Phone, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import api from '../lib/api';

export default function Kontak() {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.response?.data?.error || 'Gagal mengirim pesan. Coba lagi.');
    }
  };

  return (
    <div className="w-full bg-background min-h-screen">

      {/* Parallax Header */}
      <section className="relative min-h-[40vh] md:min-h-[60vh] flex flex-col items-center justify-center pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden rounded-b-[1.5rem] md:rounded-b-[3rem] shadow-xl md:shadow-2xl mb-8 md:mb-24">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img style={{ y: yBg, scale: 1.2 }} src="/assets/bg_kontak.png" className="w-full h-full object-cover origin-top" alt="Kontak Background" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center px-4 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-extrabold font-heading text-white tracking-tighter leading-tight text-[clamp(2.5rem,5vw,5rem)]"
          >
            {t('kontak.letsTalk')}
          </motion.h1>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-24">

          {/* Contact Info */}
          <div>
            <h2 className="text-4xl font-heading font-bold text-foreground mb-8 md:mb-12">{t('kontak.reachOut')}</h2>
            <div className="space-y-8 md:space-y-12">
              <a href="https://wa.me/6281993294170" target="_blank" rel="noreferrer" className="flex items-start gap-4 md:gap-6 group">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone size={24} className="md:w-7 md:h-7" />
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-bold font-heading text-foreground mb-1 md:mb-2">WhatsApp</h4>
                  <p className="text-lg md:text-2xl font-light text-foreground/70">+62 819-9329-4170</p>
                </div>
              </a>

              <a href="mailto:ekrafhimatika@gmail.com" className="flex items-start gap-4 md:gap-6 group">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail size={24} className="md:w-7 md:h-7" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-lg md:text-xl font-bold font-heading text-foreground mb-1 md:mb-2">Email</h4>
                  <p className="text-lg md:text-2xl font-light text-foreground/70 truncate">ekrafhimatika@gmail.com</p>
                </div>
              </a>

              <div className="flex items-start gap-4 md:gap-6">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0">
                  <MapPin size={24} className="md:w-7 md:h-7" />
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-bold font-heading text-foreground mb-1 md:mb-2">{t('kontak.office')}</h4>
                  <p className="text-base md:text-xl font-light text-foreground/70 max-w-xs leading-relaxed">
                    {t('kontak.address')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-secondary/70 backdrop-blur-2xl border border-border/50 shadow-2xl p-6 md:p-16 rounded-[2rem] md:rounded-[3rem]">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8 md:mb-10">{t('kontak.sendMessage')}</h3>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 py-12 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold font-heading text-foreground mb-2">Pesan Terkirim!</h4>
                  <p className="text-foreground/60">Tim kami akan segera menghubungi Anda. Terima kasih!</p>
                </div>
                <button onClick={() => setStatus('idle')} className="text-primary font-bold hover:underline">
                  Kirim pesan lain
                </button>
              </motion.div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                {status === 'error' && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
                    <AlertCircle size={18} />
                    {errorMsg}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold tracking-widest uppercase text-primary/60 mb-3">{t('kontak.name')}</label>
                  <input
                    type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-primary/20 pb-4 text-xl text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Nama Kamu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-widest uppercase text-primary/60 mb-3">{t('kontak.email')}</label>
                  <input
                    type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-primary/20 pb-4 text-xl text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary transition-colors"
                    placeholder="emailkamu@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-widest uppercase text-primary/60 mb-3">{t('kontak.message')}</label>
                  <textarea
                    rows={4} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-primary/20 pb-4 text-xl text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder={t('kontak.messagePlaceholder')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-primary text-background font-heading font-bold text-xl py-6 rounded-full hover:bg-foreground hover:text-background transition-all flex justify-center items-center gap-3 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</>
                  ) : (
                    <>{t('kontak.sendBtn')} <ArrowRight size={24} /></>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
