import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Upload, Search } from 'lucide-react';
import api from '../../lib/api';

type Portfolio = {
  id: string;
  title: string;
  clientName?: string;
  description?: string;
  divisi: string;
  images: { url: string }[];
  createdAt: string;
};

const emptyForm = { title: '', clientName: '', description: '', divisi: 'KONVEKSI', imageUrl: '' };
const BACKEND_URL = `http://${window.location.hostname}:5000`;

export default function AdminPortfolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPortfolios = async () => {
    try {
      const { data } = await api.get('/portfolio');
      setPortfolios(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPortfolios(); }, []);

  const resolveUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('clientName', formData.clientName);
      fd.append('description', formData.description);
      fd.append('divisi', formData.divisi);
      fd.append('imageUrl', formData.imageUrl);
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await api.put(`/portfolio/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/portfolio', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      closeModal();
      fetchPortfolios();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menyimpan portfolio');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus portfolio ini?')) return;
    try { await api.delete(`/portfolio/${id}`); fetchPortfolios(); }
    catch { alert('Gagal menghapus portfolio'); }
  };

  const openEdit = (p: Portfolio) => {
    setFormData({ title: p.title, clientName: p.clientName || '', description: p.description || '', divisi: p.divisi, imageUrl: '' });
    setImagePreview(resolveUrl(p.images?.[0]?.url));
    setImageFile(null);
    setEditingId(p.id);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingId(null); setFormData({ ...emptyForm }); setImageFile(null); setImagePreview(''); };

  const inputCls = 'w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all';

  const filtered = portfolios.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.clientName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground">Manajemen Portfolio</h1>
          <p className="text-foreground/50 mt-1">{portfolios.length} karya tersimpan</p>
        </div>
        <button onClick={() => { setFormData({ ...emptyForm }); setEditingId(null); setShowModal(true); }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-foreground transition-all shrink-0">
          <Plus size={20} /> Tambah Portfolio
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
        <input type="text" placeholder="Cari portfolio..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:border-primary text-foreground" />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-muted" />
              <div className="p-4 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-1/2" /></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-foreground/40">
          <p className="text-xl mb-2">Belum ada portfolio.</p>
          <p className="text-sm">Klik "Tambah Portfolio" untuk memulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all hover:border-primary/20">
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                {p.images?.[0]?.url ? (
                  <img src={resolveUrl(p.images[0].url)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/20 text-sm">No image</div>
                )}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(p)} className="bg-white/90 text-foreground p-2 rounded-lg shadow hover:bg-white"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} className="bg-red-500/90 text-white p-2 rounded-lg shadow hover:bg-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs font-bold uppercase tracking-widest text-primary/60">{p.divisi.replace('_', ' ')}</span>
                <h3 className="font-bold text-foreground mt-1 mb-0.5">{p.title}</h3>
                {p.clientName && <p className="text-sm text-foreground/50">{p.clientName}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="bg-card w-full max-w-xl rounded-[2rem] border border-border shadow-2xl my-8">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-2xl font-heading font-bold">{editingId ? 'Edit Portfolio' : 'Tambah Portfolio'}</h2>
                <button onClick={closeModal} className="p-2 hover:bg-muted rounded-xl"><X size={22} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-5">
                  {/* Upload */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Foto Portfolio</label>
                    <div onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                      {imagePreview ? (
                        <img src={imagePreview} alt="preview" className="h-32 rounded-xl object-cover mx-auto" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-foreground/40">
                          <Upload size={32} />
                          <span className="text-sm">Klik untuk upload foto</span>
                        </div>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
                      const f = e.target.files?.[0]; if (!f) return;
                      setImageFile(f); setImagePreview(URL.createObjectURL(f));
                    }} />
                    <input type="url" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Atau masukkan URL gambar..." className={inputCls + ' mt-3 text-sm'} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Judul *</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputCls} placeholder="Jaket Angkatan 2024" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Nama Klien</label>
                      <input type="text" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} className={inputCls} placeholder="BEM Fakultas..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Divisi *</label>
                      <select value={formData.divisi} onChange={e => setFormData({ ...formData, divisi: e.target.value })} className={inputCls}>
                        <option value="KONVEKSI">Konveksi</option>
                        <option value="MERCH">Merchandise</option>
                        <option value="DIGITAL_PRINTING">Digital Printing</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Deskripsi</label>
                    <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputCls + ' resize-none'} placeholder="Cerita di balik karya..." />
                  </div>
                </div>
                <div className="p-6 border-t border-border flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-foreground/70 hover:bg-muted">Batal</button>
                  <button type="submit" disabled={saving} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-foreground transition-all disabled:opacity-50 flex items-center gap-2">
                    {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</> : 'Simpan Portfolio'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
