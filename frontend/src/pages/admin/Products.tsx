import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Upload, Star } from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

type Product = {
  id: string;
  name: string;
  description: string;
  divisi: string;
  price: string;
  minOrder: number;
  status: string;
  imageUrl?: string;
  videoUrl?: string;
  specifications?: string;
  isRecommended: boolean;
  images: { id: string; url: string }[];
  options: { id: string; name: string; values: string; required: boolean }[];
};

const emptyForm = {
  name: '', description: '', divisi: 'KONVEKSI', price: '',
  minOrder: 1, status: 'ACTIVE', imageUrl: '', videoUrl: '',
  specifications: '', isRecommended: false, options: [] as { name: string; uiType: string; choices: {label: string, priceMod: number, metadata?: string}[]; required: boolean }[],
};

const BACKEND_URL = `http://${window.location.hostname}:5000`;

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<{id?: string, url: string}[]>([]);
  const [existingImagesToKeep, setExistingImagesToKeep] = useState<string[]>([]);
  
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuthStore();

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products/admin/all');
      setProducts(data);
    } catch {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch { /* ignore */ }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const resolveImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${BACKEND_URL}${url}`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    // Add to existing files
    setImageFiles(prev => [...prev, ...files]);
    
    // Generate previews
    const newPreviews = files.map(file => ({ url: URL.createObjectURL(file) }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index: number) => {
    const preview = imagePreviews[index];
    if (preview.id) {
      // Removing an existing image from DB
      setExistingImagesToKeep(prev => prev.filter(id => id !== preview.id));
    } else {
      // Removing a newly uploaded file
      // We need to figure out which file it corresponds to
      // This is a simplified approach assuming order matches exactly for new files
      const newFilesIndex = index - imagePreviews.filter(p => p.id).length;
      if (newFilesIndex >= 0) {
        setImageFiles(prev => prev.filter((_, i) => i !== newFilesIndex));
      }
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      fd.append('divisi', formData.divisi);
      fd.append('price', formData.price);
      fd.append('minOrder', String(formData.minOrder));
      fd.append('status', formData.status);
      fd.append('isRecommended', String(formData.isRecommended));
      fd.append('imageUrl', formData.imageUrl);
      fd.append('videoUrl', formData.videoUrl);
      fd.append('specifications', formData.specifications);
      fd.append('options', JSON.stringify(formData.options));
      fd.append('existingImages', JSON.stringify(existingImagesToKeep));
      
      imageFiles.forEach(file => {
        fd.append('images', file);
      });

      if (editingId) {
        await api.put(`/products/${editingId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      closeModal();
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menyimpan produk');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini? Tindakan tidak bisa dibatalkan.')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch { alert('Gagal menghapus produk'); }
  };

  const toggleRecommended = async (p: Product) => {
    try {
      // API call expects FormData for put. We can either do full update or partial.
      // Since our API currently does full update, we'll construct the full object.
      const fd = new FormData();
      fd.append('name', p.name);
      fd.append('description', p.description);
      fd.append('divisi', p.divisi);
      fd.append('price', p.price);
      fd.append('minOrder', String(p.minOrder));
      fd.append('status', p.status);
      fd.append('isRecommended', String(!p.isRecommended));
      fd.append('imageUrl', p.imageUrl || '');
      fd.append('videoUrl', p.videoUrl || '');
      fd.append('specifications', p.specifications || '');
      fd.append('options', JSON.stringify(p.options));
      fd.append('existingImages', JSON.stringify(p.images.map(img => img.id)));

      await api.put(`/products/${p.id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchProducts();
    } catch {
      alert('Gagal mengupdate status rekomendasi');
    }
  };

  const openEdit = (p: Product) => {
    setFormData({
      name: p.name, description: p.description, divisi: p.divisi,
      price: p.price, minOrder: p.minOrder, status: p.status,
      imageUrl: p.imageUrl || '', videoUrl: p.videoUrl || '',
      specifications: p.specifications || '', isRecommended: p.isRecommended,
      options: p.options.map(o => {
        let uiType = 'dropdown';
        let choices = [];
        try {
          if (typeof o.values === 'string' && o.values.startsWith('{')) {
            const parsed = JSON.parse(o.values);
            uiType = parsed.uiType || 'dropdown';
            choices = parsed.choices || [];
          } else if (typeof o.values === 'string' && o.values.startsWith('[')) {
            choices = JSON.parse(o.values);
            // Auto detect bulk
            if (o.name.toLowerCase().includes('ukuran') || o.name.toLowerCase().includes('size')) uiType = 'stepper';
          } else if (typeof o.values === 'string') {
            choices = o.values.split(',').filter(v => v.trim()).map(v => ({ label: v.trim(), priceMod: 0 }));
          }
        } catch {
          choices = [];
        }
        return { name: o.name, uiType, choices, required: o.required };
      }),
    });
    
    // Load existing images
    const existing = p.images?.map(img => ({ id: img.id, url: resolveImageUrl(img.url) })) || [];
    if (existing.length === 0 && p.imageUrl) {
      existing.push({ id: undefined, url: resolveImageUrl(p.imageUrl) });
    }
    
    setImagePreviews(existing);
    setExistingImagesToKeep(p.images?.map(img => img.id) || []);
    setImageFiles([]);
    
    setEditingId(p.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ ...emptyForm });
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImagesToKeep([]);
  };

  const addOption = () => setFormData(f => ({ ...f, options: [...f.options, { name: '', uiType: 'dropdown', choices: [{label: '', priceMod: 0}], required: true }] }));
  const removeOption = (i: number) => setFormData(f => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }));
  const updateOption = (i: number, key: 'name' | 'required' | 'uiType', val: any) =>
    setFormData(f => ({ ...f, options: f.options.map((o, idx) => idx === i ? { ...o, [key]: val } : o) }));
  
  const addOptionValue = (optIdx: number) => {
    setFormData(f => {
      const newOpts = [...f.options];
      newOpts[optIdx].choices.push({ label: '', priceMod: 0, metadata: '' });
      return { ...f, options: newOpts };
    });
  };
  const updateOptionValue = (optIdx: number, valIdx: number, key: 'label' | 'priceMod' | 'metadata', val: any) => {
    setFormData(f => {
      const newOpts = [...f.options];
      newOpts[optIdx].choices[valIdx] = { ...newOpts[optIdx].choices[valIdx], [key]: val };
      return { ...f, options: newOpts };
    });
  };
  const removeOptionValue = (optIdx: number, valIdx: number) => {
    setFormData(f => {
      const newOpts = [...f.options];
      newOpts[optIdx].choices = newOpts[optIdx].choices.filter((_, i) => i !== valIdx);
      return { ...f, options: newOpts };
    });
  };

  const filtered = products.filter(p => {
    const matchQ = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchD = filterDivisi === 'ALL' || p.divisi === filterDivisi;
    return matchQ && matchD;
  });

  const statusColor = (s: string) => s === 'ACTIVE' ? 'bg-green-100 text-green-700' : s === 'INACTIVE' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500';
  const inputCls = 'w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all';

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground">Manajemen Produk</h1>
          <p className="text-foreground/50 mt-1">{products.length} produk total</p>
        </div>
        <button
          onClick={() => { setFormData({ ...emptyForm }); setEditingId(null); setShowModal(true); }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-foreground transition-all shrink-0"
        >
          <Plus size={20} /> Tambah Produk
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text" placeholder="Cari produk..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
            />
          </div>
          <select
            value={filterDivisi} onChange={e => setFilterDivisi(e.target.value)}
            className="bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary"
          >
            <option value="ALL">Semua Divisi</option>
            <option value="KONVEKSI">Konveksi</option>
            <option value="MERCH">Merchandise</option>
            <option value="DIGITAL_PRINTING">Digital Printing</option>
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-foreground/50 animate-pulse">Memuat produk...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-4 text-xs font-bold tracking-widest uppercase text-primary/60">Foto</th>
                  <th className="p-4 text-xs font-bold tracking-widest uppercase text-primary/60">Nama Produk</th>
                  <th className="p-4 text-xs font-bold tracking-widest uppercase text-primary/60">Divisi</th>
                  <th className="p-4 text-xs font-bold tracking-widest uppercase text-primary/60">Harga</th>
                  <th className="p-4 text-xs font-bold tracking-widest uppercase text-primary/60">Status</th>
                  <th className="p-4 text-xs font-bold tracking-widest uppercase text-primary/60 text-center">Rekomendasi</th>
                  <th className="p-4 text-xs font-bold tracking-widest uppercase text-primary/60 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="p-12 text-center text-foreground/40">Tidak ada produk ditemukan.</td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary border border-border">
                        {(p.imageUrl || p.images?.[0]?.url) ? (
                          <img src={resolveImageUrl(p.imageUrl || p.images?.[0]?.url)} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-foreground/20 text-xs">No img</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-foreground max-w-xs">
                      <p className="truncate">{p.name}</p>
                    </td>
                    <td className="p-4 text-foreground/60 text-sm">{p.divisi.replace('_', ' ')}</td>
                    <td className="p-4 text-foreground/80 font-medium text-sm">Rp {Number(p.price).toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor(p.status)}`}>{p.status}</span>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleRecommended(p)} className={`p-2 rounded-lg transition-colors ${p.isRecommended ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`} title={p.isRecommended ? "Hapus dari rekomendasi" : "Jadikan rekomendasi"}>
                        <Star size={18} fill={p.isRecommended ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Modal CRUD ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="bg-card w-full max-w-2xl rounded-[2rem] border border-border shadow-2xl my-8"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-2xl font-heading font-bold">{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                <button onClick={closeModal} className="p-2 hover:bg-muted rounded-xl transition-colors"><X size={22} /></button>
              </div>

              <form id="productForm" onSubmit={handleSubmit}>
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

                  {/* Foto Upload (Multiple) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Foto Produk</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors group mb-4"
                    >
                      <div className="flex flex-col items-center gap-3 text-foreground/40 group-hover:text-primary transition-colors">
                        <Upload size={36} />
                        <span className="text-sm font-medium">Klik untuk upload foto (bisa lebih dari satu)</span>
                        <span className="text-xs">JPG, PNG, WebP — maks. 5MB</span>
                      </div>
                    </div>
                    <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                    
                    {/* Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="flex gap-3 overflow-x-auto py-2">
                        {imagePreviews.map((preview, idx) => (
                          <div key={idx} className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-border">
                            <img src={preview.url} alt="preview" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removePreview(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-3">
                      <input
                        type="url" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="Atau masukkan URL gambar utama (opsional)..."
                        className={inputCls + ' text-sm'}
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Nama Produk *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder="Kaos Custom, Mug, Banner..." />
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Divisi *</label>
                      <select value={formData.divisi} onChange={e => setFormData({ ...formData, divisi: e.target.value })} className={inputCls}>
                        <option value="KONVEKSI">Konveksi</option>
                        <option value="MERCH">Merchandise</option>
                        <option value="DIGITAL_PRINTING">Digital Printing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Status *</label>
                      <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className={inputCls}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Harga Mulai (Rp) *</label>
                      <input required type="number" min={0} value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className={inputCls} placeholder="54000" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Min. Order (pcs)</label>
                      <input type="number" min={1} value={formData.minOrder} onChange={e => setFormData({ ...formData, minOrder: Number(e.target.value) })} className={inputCls} />
                    </div>
                  </div>
                  
                  {/* Recommended Checkbox */}
                  <div className="flex items-center gap-3 bg-secondary/50 p-4 rounded-xl border border-border">
                    <input 
                      type="checkbox" 
                      id="isRecommended" 
                      checked={formData.isRecommended}
                      onChange={e => setFormData({...formData, isRecommended: e.target.checked})}
                      className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary"
                    />
                    <label htmlFor="isRecommended" className="font-bold text-sm cursor-pointer">
                      Tampilkan di Bagian Rekomendasi (Halaman Depan)
                    </label>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Deskripsi *</label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputCls + ' resize-none'} placeholder="Deskripsi produk..." />
                  </div>

                  {/* Specifications */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Spesifikasi</label>
                    <textarea rows={3} value={formData.specifications} onChange={e => setFormData({ ...formData, specifications: e.target.value })} className={inputCls + ' resize-none'} placeholder="Min. Order: 12 pcs&#10;Bahan: Cotton Combed 30s&#10;..." />
                  </div>

                  {/* Video URL */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">URL Video (opsional)</label>
                    <input type="url" value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} className={inputCls} placeholder="https://..." />
                  </div>

                  {/* Options / Varian */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-primary/60">Varian / Opsi Produk</label>
                      <button type="button" onClick={addOption} className="text-xs font-bold text-primary hover:text-foreground flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary/30 hover:bg-primary/5 transition-all">
                        <Plus size={12} /> Tambah Opsi
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.options.map((opt, i) => (
                        <div key={i} className="bg-muted/50 rounded-xl p-4 flex flex-col gap-3 border border-border">
                          <div className="flex gap-3 items-start">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <input
                                type="text" value={opt.name} onChange={e => updateOption(i, 'name', e.target.value)}
                                placeholder="Nama opsi (mis: Bahan, Warna, Ukuran)"
                                className={inputCls + ' text-sm'}
                              />
                              <select 
                                value={opt.uiType} onChange={e => updateOption(i, 'uiType', e.target.value)}
                                className={inputCls + ' text-sm'}
                              >
                                <option value="dropdown">Dropdown (List)</option>
                                <option value="radio">Radio Buttons / Kotak</option>
                                <option value="swatch">Color Swatch (Warna)</option>
                                <option value="stepper">Kuantitas Matrix (Banyak Ukuran)</option>
                              </select>
                            </div>
                            <button type="button" onClick={() => removeOption(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-0.5">
                              <X size={16} />
                            </button>
                          </div>
                          <div className="space-y-2">
                            {Array.isArray(opt.choices) && opt.choices.map((v, vIdx) => (
                              <div key={vIdx} className="flex flex-wrap md:flex-nowrap gap-2 items-center">
                                <input
                                  type="text" value={v.label} onChange={e => updateOptionValue(i, vIdx, 'label', e.target.value)}
                                  placeholder="Nilai (mis: S, Hitam)"
                                  className={inputCls + ' text-sm flex-1 min-w-[150px]'}
                                />
                                {opt.uiType === 'swatch' && (
                                  <div className="relative w-24">
                                    <input
                                      type="color" value={v.metadata || '#000000'} onChange={e => updateOptionValue(i, vIdx, 'metadata', e.target.value)}
                                      className="w-full h-11 rounded-lg cursor-pointer border-0 bg-transparent"
                                      title="Pilih Warna"
                                    />
                                  </div>
                                )}
                                <div className="relative w-32">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 text-sm">+Rp</span>
                                  <input
                                    type="number" min={0} value={v.priceMod} onChange={e => updateOptionValue(i, vIdx, 'priceMod', Number(e.target.value))}
                                    className={inputCls + ' text-sm pl-10'}
                                    placeholder="0"
                                  />
                                </div>
                                <button type="button" onClick={() => removeOptionValue(i, vIdx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                            <button type="button" onClick={() => addOptionValue(i)} className="text-xs font-bold text-primary hover:underline mt-1">
                              + Tambah Nilai
                            </button>
                          </div>
                        </div>
                      ))}
                      {formData.options.length === 0 && (
                        <p className="text-center text-foreground/30 text-sm py-4 border border-dashed border-border rounded-xl">
                          Belum ada opsi. Klik "+ Tambah Opsi" untuk menambah varian.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-border flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-foreground/70 hover:bg-muted transition-all">
                    Batal
                  </button>
                  <button type="submit" disabled={saving} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-foreground transition-all disabled:opacity-50 flex items-center gap-2">
                    {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</> : 'Simpan Produk'}
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
