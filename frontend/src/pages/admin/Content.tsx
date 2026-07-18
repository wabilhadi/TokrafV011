import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings } from 'lucide-react';
import api from '../../lib/api';

const CONTENT_KEYS = [
  { key: 'WA_NUMBER', label: 'Nomor WhatsApp Admin', placeholder: '6281993294170', type: 'text', hint: 'Format: 628xxx (tanpa + atau spasi)' },
  { key: 'HERO_TITLE', label: 'Judul Hero (Baris 1)', placeholder: 'Creative', type: 'text', hint: 'Teks besar di bagian atas halaman utama' },
  { key: 'HERO_TITLE_2', label: 'Judul Hero (Baris 2)', placeholder: 'Production', type: 'text', hint: 'Baris kedua teks hero (berwarna merah)' },
  { key: 'HERO_SUBTITLE', label: 'Subtitle Hero', placeholder: 'Platform produksi kreatif...', type: 'text', hint: '' },
  { key: 'ABOUT_TEXT', label: 'Teks Tentang Kami', placeholder: 'TOKRAF adalah...', type: 'textarea', hint: '' },
  { key: 'ADDRESS', label: 'Alamat Kantor', placeholder: 'Jl. Kampus No. 1...', type: 'textarea', hint: '' },
  { key: 'EMAIL', label: 'Email Kontak', placeholder: 'ekrafhimatika@gmail.com', type: 'text', hint: '' },
];

export default function AdminContent() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/content')
      .then(r => setValues(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const entries = Object.entries(values).map(([key, value]) => ({ key, value }));
      await api.post('/content/bulk', entries);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Gagal menyimpan konten');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground">Manajemen Konten</h1>
          <p className="text-foreground/50 mt-1">Edit teks dan informasi yang tampil di website.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-foreground transition-all disabled:opacity-50"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
          ) : saved ? (
            <><Save size={18} /> Tersimpan! ✓</>
          ) : (
            <><Save size={18} /> Simpan Semua</>
          )}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
              <div className="h-3 bg-muted rounded w-1/4 mb-4" />
              <div className="h-10 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {CONTENT_KEYS.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">{item.label}</label>
              {item.hint && <p className="text-xs text-foreground/40 mb-3">{item.hint}</p>}
              {item.type === 'textarea' ? (
                <textarea
                  rows={4}
                  value={values[item.key] || ''}
                  onChange={e => setValues({ ...values, [item.key]: e.target.value })}
                  placeholder={item.placeholder}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={values[item.key] || ''}
                  onChange={e => setValues({ ...values, [item.key]: e.target.value })}
                  placeholder={item.placeholder}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
