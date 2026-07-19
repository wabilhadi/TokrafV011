import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import api from '../lib/api';

export default function Kontak() {
  const { t } = useTranslation();
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

  const contactItems = [
    {
      icon: <Phone size={20} />,
      label: 'WhatsApp',
      value: '+62 819-9329-4170',
      href: 'https://wa.me/6281993294170',
    },
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'ekrafhimatika@gmail.com',
      href: 'mailto:ekrafhimatika@gmail.com',
    },
    {
      icon: <MapPin size={20} />,
      label: t('kontak.office'),
      value: t('kontak.address'),
      href: null,
    },
  ];

  return (
    <div className="w-full bg-background min-h-screen overflow-x-hidden">

      {/* ── Hero banner ── */}
      <div className="relative h-[180px] md:h-[320px] overflow-hidden">
        <img
          src="/assets/bg_kontak.png"
          alt="Kontak Tokraf"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full flex flex-col justify-end px-5 pb-6 md:pb-10 md:px-12">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-extrabold font-heading text-white text-[clamp(2rem,6vw,4.5rem)] tracking-tight leading-none"
          >
            {t('kontak.letsTalk')}
          </motion.h1>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="section-px py-6 md:py-14 pb-16">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">

            {/* Contact info */}
            <div>
              <h2 className="text-xl md:text-3xl font-heading font-bold text-foreground mb-6">
                {t('kontak.reachOut')}
              </h2>
              <div className="space-y-4">
                {contactItems.map((item) => (
                  <div key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/40 hover:bg-secondary transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-0.5">{item.label}</p>
                          <p className="text-sm md:text-base font-semibold text-foreground truncate">{item.value}</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/40">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-0.5">{item.label}</p>
                          <p className="text-sm md:text-base font-semibold text-foreground leading-relaxed">{item.value}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-secondary/30 border border-border/30 rounded-2xl p-5 md:p-8">
              <h3 className="text-lg md:text-2xl font-heading font-bold text-foreground mb-5">
                {t('kontak.sendMessage')}
              </h3>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-10 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-heading text-foreground mb-1">Pesan Terkirim!</h4>
                    <p className="text-foreground/60 text-sm">Tim kami akan segera menghubungi Anda.</p>
                  </div>
                  <button onClick={() => setStatus('idle')} className="text-primary font-bold text-sm hover:underline mt-2">
                    Kirim pesan lain →
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {status === 'error' && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
                      <AlertCircle size={16} />
                      {errorMsg}
                    </div>
                  )}

                  {[
                    { id: 'name', label: t('kontak.name'), type: 'text', placeholder: 'Nama Kamu', key: 'name' as const },
                    { id: 'email', label: t('kontak.email'), type: 'email', placeholder: 'email@gmail.com', key: 'email' as const },
                  ].map(field => (
                    <div key={field.id}>
                      <label className="block text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        required
                        value={form[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm md:text-base text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2">
                      {t('kontak.message')}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder={t('kontak.messagePlaceholder')}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm md:text-base text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-primary text-white font-heading font-bold py-4 rounded-xl flex justify-center items-center gap-2 text-sm md:text-base hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</>
                    ) : (
                      <>{t('kontak.sendBtn')} <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
