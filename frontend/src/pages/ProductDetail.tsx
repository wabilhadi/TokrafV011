import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { CheckCircle2, ShoppingBag, CheckCircle, Minus, Plus, MessageCircle, X, Star, Upload } from 'lucide-react';
import { TOKRAF_PRODUCTS } from '../lib/products';

// (Dynamic Configurator: options are now strictly from database)

const DUMMY_PRODUCTS: any[] = TOKRAF_PRODUCTS;

function OptionPill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
        selected
          ? 'bg-primary text-white border-primary shadow-md scale-105'
          : 'bg-background text-foreground/70 border-border hover:border-primary hover:text-primary'
      }`}
    >
      {label}
    </button>
  );
}

// ─── Customer Reviews Component ───────────────────────────────────────────────
function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [media, setMedia] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/${productId}`);
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('comment', comment);
      formData.append('rating', rating.toString());
      if (media) formData.append('media', media);

      await api.post(`/reviews/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setName('');
      setComment('');
      setRating(5);
      setMedia(null);
      setPreview(null);
      fetchReviews();
    } catch (error) {
      console.error('Failed to submit review', error);
      alert('Gagal mengirim ulasan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 border-t border-border/50 pt-10">
      <h3 className="text-2xl font-bold font-heading mb-8">Ulasan Pelanggan</h3>
      
      {/* Review List */}
      <div className="space-y-6 mb-10">
        {reviews.length === 0 ? (
          <p className="text-foreground/50 text-center py-8">Belum ada ulasan untuk produk ini. Jadilah yang pertama!</p>
        ) : (
          reviews.map((rev: any) => (
            <div key={rev.id} className="border-b border-border/50 pb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">{rev.name}</span>
                <span className="text-sm text-foreground/40">{new Date(rev.createdAt).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < rev.rating ? '#eab308' : 'none'} className={i < rev.rating ? 'text-yellow-500' : 'text-gray-300'} />
                ))}
              </div>
              <p className="text-foreground/80 mb-3">{rev.comment}</p>
              {rev.mediaUrl && (
                <img src={`http://localhost:5000${rev.mediaUrl}`} alt="Review media" className="h-32 rounded-lg object-cover" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Form */}
      <div className="bg-secondary/50 rounded-2xl p-6">
        <h4 className="font-bold mb-4">Tulis Ulasan Anda</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none">
                <Star size={24} fill={star <= rating ? '#eab308' : 'none'} className={star <= rating ? 'text-yellow-500' : 'text-gray-300'} />
              </button>
            ))}
          </div>
          <input required placeholder="Nama Anda" value={name} onChange={e => setName(e.target.value)}
            className="w-full border border-border rounded-xl px-4 py-3 bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <textarea required placeholder="Bagaimana produk kami?" value={comment} onChange={e => setComment(e.target.value)} rows={3}
            className="w-full border border-border rounded-xl px-4 py-3 bg-background focus:ring-2 focus:ring-primary focus:outline-none resize-none"
          />
          
          <div>
            <input type="file" id="media-upload" accept="image/*,video/*" className="hidden" onChange={handleMediaChange} />
            <label htmlFor="media-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors text-sm font-medium">
              <Upload size={16} /> {media ? media.name : 'Upload Foto/Video (Opsional)'}
            </label>
            {preview && <img src={preview} alt="Preview" className="mt-2 h-20 rounded-lg object-cover" />}
          </div>
          
          <button type="submit" disabled={loading} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? 'Mengirim...' : 'Kirim Ulasan'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Universal Configurator ─────────────────────────────────────────────────
import { calculateBaseUnitPrice, calculateItemSubtotal } from '../lib/pricingEngine';

function UniversalConfigurator({ product, onAdd }: { product: any; onAdd: () => void }) {
  const parsedOptions = (product.options || []).map((opt: any) => {
    let uiType = 'dropdown';
    let choices: any[] = [];
    try {
      if (typeof opt.values === 'string' && opt.values.startsWith('{')) {
        const parsed = JSON.parse(opt.values);
        uiType = parsed.uiType || 'dropdown';
        choices = parsed.choices || [];
      } else if (typeof opt.values === 'string' && opt.values.startsWith('[')) {
        choices = JSON.parse(opt.values);
        if (opt.name.toLowerCase().includes('ukuran') || opt.name.toLowerCase().includes('size')) uiType = 'stepper';
      } else if (typeof opt.values === 'string') {
        choices = opt.values.split(',').filter((v:string) => v.trim()).map((v:string) => ({ label: v.trim(), priceMod: 0 }));
      } else if (Array.isArray(opt.values)) {
        choices = opt.values;
        if (opt.name.toLowerCase().includes('ukuran') || opt.name.toLowerCase().includes('size')) uiType = 'stepper';
      }
    } catch {
      choices = [];
    }
    return { ...opt, uiType, choices };
  });

  const bulkOption = parsedOptions.find((o: any) => o.uiType === 'stepper');
  const globalOptions = parsedOptions.filter((o: any) => o !== bulkOption);

  const [selections, setSelections] = useState<Record<string, {label: string, priceMod: number, metadata?: string}>>({});
  const [bulkQty, setBulkQty] = useState<Record<string, number>>({});
  const [qty, setQty] = useState(product.minOrder ?? 1); // Used if no bulk option
  
  const [note, setNote] = useState('');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    const initial: Record<string, any> = {};
    globalOptions.forEach((opt: any) => {
      if (opt.choices.length > 0) initial[opt.name] = opt.choices[0];
    });
    setSelections(initial);
  }, [product.id]);

  const basePrice = Number(product.price || 0);
  const globalMods = Object.values(selections).map(v => v?.priceMod || 0);
  const effectiveBasePrice = calculateBaseUnitPrice(basePrice, globalMods);

  let totalQty = 0;
  if (bulkOption) {
    bulkOption.choices.forEach((v: any) => { totalQty += (bulkQty[v.label] || 0); });
  } else {
    totalQty = qty;
  }

  // Calculate pricing
  const pricing = calculateItemSubtotal(effectiveBasePrice, totalQty);

  // Re-calculate grand total properly adding per-item specifics
  let customGrandTotal = 0;
  if (bulkOption) {
    bulkOption.choices.forEach((v: any) => {
      const q = bulkQty[v.label] || 0;
      if (q > 0) {
        const itemPricing = calculateItemSubtotal(effectiveBasePrice + (v.priceMod || 0), totalQty); // Discount is based on totalQty
        customGrandTotal += (itemPricing.finalUnitPrice * q);
      }
    });
  } else {
    customGrandTotal = pricing.grandTotal;
  }

  const handleAdd = () => {
    if (totalQty < (product.minOrder ?? 1)) return;
    
    const globalOptsRecord = Object.fromEntries(Object.entries(selections).map(([k, v]) => [k, v.label]));

    if (bulkOption) {
      bulkOption.choices.forEach((v: any) => {
        const q = bulkQty[v.label] || 0;
        if (q > 0) {
          addItem({
            productId: product.id,
            name: product.name,
            price: effectiveBasePrice + (v.priceMod || 0),
            quantity: q,
            imageUrl: product.images?.[0]?.url || product.imageUrl,
            customOptions: { ...globalOptsRecord, [bulkOption.name]: v.label },
            customNote: note || undefined,
          });
        }
      });
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        price: effectiveBasePrice,
        quantity: totalQty,
        imageUrl: product.images?.[0]?.url || product.imageUrl,
        customOptions: globalOptsRecord,
        customNote: note || undefined,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    onAdd();
  };

  const handleSendWA = (e: React.FormEvent) => {
    e.preventDefault();
    // Re-use logic or navigate to Cart checkout. Usually better to direct them to Cart now.
    // For now, simple redirect
    handleAdd();
    window.location.href = '/cart';
  };

  return (
    <div className="relative">
      <div className="space-y-8 pb-10 border-b border-border mb-10">
        
        {/* Opsi Global */}
        {globalOptions.map((opt: any) => (
          <div key={opt.name}>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary/60 mb-3">{opt.name}</h3>
            
            {opt.uiType === 'swatch' ? (
              <div className="flex flex-wrap gap-3">
                {opt.choices.map((v: any) => (
                  <button
                    key={v.label}
                    onClick={() => setSelections(prev => ({ ...prev, [opt.name]: v }))}
                    title={v.label + (v.priceMod > 0 ? ` (+Rp${v.priceMod.toLocaleString()})` : '')}
                    className={`w-12 h-12 rounded-full border-4 transition-all relative ${selections[opt.name]?.label === v.label ? 'border-primary scale-110 shadow-lg' : 'border-transparent shadow-sm hover:scale-105'}`}
                    style={{ backgroundColor: v.metadata || '#000000' }}
                  />
                ))}
              </div>
            ) : opt.uiType === 'radio' ? (
              <div className="grid grid-cols-2 gap-3">
                 {opt.choices.map((v: any) => (
                  <div 
                    key={v.label}
                    onClick={() => setSelections(prev => ({ ...prev, [opt.name]: v }))}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selections[opt.name]?.label === v.label ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}
                  >
                    <div className="font-bold">{v.label}</div>
                    {v.priceMod > 0 && <div className="text-sm text-primary">+Rp{v.priceMod.toLocaleString('id-ID')}</div>}
                  </div>
                ))}
              </div>
            ) : opt.uiType === 'dropdown' ? (
              <select 
                value={selections[opt.name]?.label || ''}
                onChange={e => {
                  const sel = opt.choices.find((c:any) => c.label === e.target.value);
                  if (sel) setSelections(prev => ({ ...prev, [opt.name]: sel }));
                }}
                className="w-full border-2 border-border rounded-xl px-4 py-3 bg-background text-foreground font-medium focus:border-primary focus:outline-none"
              >
                {opt.choices.map((v: any) => (
                  <option key={v.label} value={v.label}>
                    {v.label} {v.priceMod > 0 ? `(+Rp${v.priceMod.toLocaleString('id-ID')})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex flex-wrap gap-2">
                {opt.choices.map((v: any) => (
                  <OptionPill 
                    key={v.label} 
                    label={v.priceMod > 0 ? `${v.label} (+Rp${v.priceMod.toLocaleString('id-ID')})` : v.label} 
                    selected={selections[opt.name]?.label === v.label} 
                    onClick={() => setSelections(prev => ({ ...prev, [opt.name]: v }))} 
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Kuantitas (Bulk or Single) */}
        {bulkOption ? (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary/60">Kuantitas per {bulkOption.name}</h3>
              <span className="text-sm font-bold text-foreground bg-secondary px-3 py-1 rounded-full">Total: {totalQty} pcs</span>
            </div>
            <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b-2 border-border">
                  <tr>
                    <th className="px-4 py-3 font-bold">{bulkOption.name}</th>
                    <th className="px-4 py-3 font-bold text-center">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkOption.choices.map((v: any) => {
                    const currentQty = bulkQty[v.label] || 0;
                    return (
                      <tr key={v.label} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">
                          {v.label} {v.priceMod > 0 && <span className="text-primary text-xs ml-2">+Rp{v.priceMod.toLocaleString('id-ID')}</span>}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => setBulkQty(prev => ({ ...prev, [v.label]: Math.max(0, currentQty - 1) }))} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 text-foreground transition-all">
                              <Minus size={14} />
                            </button>
                            <span className="font-bold w-8 text-center text-lg">{currentQty}</span>
                            <button onClick={() => setBulkQty(prev => ({ ...prev, [v.label]: currentQty + 1 }))} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 text-foreground transition-all">
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary/60 mb-3">Kuantitas (pcs)</h3>
            <div className="flex items-center gap-4">
              <button onClick={() => setQty(q => Math.max(product.minOrder ?? 1, q - 1))} className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-all">
                <Minus size={18} />
              </button>
              <span className="text-3xl font-extrabold w-16 text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-all">
                <Plus size={18} />
              </button>
            </div>
          </div>
        )}



        {/* Catatan */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary/60 mb-3">Catatan Khusus (Opsional)</h3>
          <textarea
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Misal: logo di dada kiri, sablon DTF belakang full..."
            className="w-full border-2 border-border rounded-2xl px-4 py-3 bg-background text-foreground focus:border-primary focus:outline-none resize-none"
          />
        </div>

      </div>
      
      {/* ── LIVE ORDER SUMMARY PANEL ── */}
      <div className="bg-card border-2 border-primary/20 rounded-3xl p-6 shadow-xl sticky bottom-4 md:bottom-auto top-32 z-40">
        <h3 className="font-heading font-bold text-2xl mb-4 border-b border-border pb-4">Ringkasan Pesanan</h3>
        
        <div className="space-y-3 mb-6 text-sm font-medium">
          <div className="flex justify-between">
            <span className="text-foreground/70">Harga Dasar</span>
            <span>Rp {basePrice.toLocaleString('id-ID')}</span>
          </div>
          {Object.entries(selections).map(([k, v]) => v.priceMod > 0 && (
            <div key={k} className="flex justify-between">
              <span className="text-foreground/70">{k} ({v.label})</span>
              <span className="text-primary">+ Rp {v.priceMod.toLocaleString('id-ID')}</span>
            </div>
          ))}
          <div className="flex justify-between">
            <span className="text-foreground/70">Kuantitas</span>
            <span>{totalQty} pcs</span>
          </div>
          {pricing.discountPercentage > 0 && (
            <div className="flex justify-between text-green-600 font-bold bg-green-50 p-2 rounded-lg">
              <span>Diskon Grosir ({pricing.discountPercentage}%)</span>
              <span>- Rp {(customGrandTotal * (pricing.discountPercentage / 100)).toLocaleString('id-ID')}</span>
            </div>
          )}

        </div>

        <div className="border-t border-border pt-4 mb-6">
          <div className="flex justify-between items-end">
            <span className="text-lg font-bold">Total Harga</span>
            <div className="text-right">
              {pricing.discountPercentage > 0 && (
                <div className="text-sm line-through text-foreground/40 mb-1">
                  Rp {(customGrandTotal / (1 - pricing.discountPercentage/100)).toLocaleString('id-ID')}
                </div>
              )}
              <span className="text-4xl font-extrabold text-primary leading-none">Rp {customGrandTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
        
        <button onClick={handleAdd}
          disabled={totalQty < (product.minOrder ?? 1)}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all ${
            added ? 'bg-green-500 text-white' : 
            totalQty < (product.minOrder ?? 1) ? 'bg-secondary text-foreground/40 cursor-not-allowed' :
            'bg-foreground text-background hover:bg-primary shadow-lg hover:shadow-primary/30 hover:-translate-y-1'
          }`}
        >
          {added ? <><CheckCircle size={22} /> Tersimpan!</> : <><ShoppingBag size={22} /> Tambah ke Keranjang</>}
        </button>

        {totalQty > 0 && totalQty < (product.minOrder ?? 1) && (
          <p className="text-sm text-red-500 mt-3 text-center font-bold">Minimum order {product.minOrder ?? 1} pcs</p>
        )}
      </div>

    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [cartFlash, setCartFlash] = useState(false);
  const [zoomedImg, setZoomedImg] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data || DUMMY_PRODUCTS.find(p => p.id === id) || null);
      } catch {
        setProduct(DUMMY_PRODUCTS.find(p => p.id === id) || null);
      } finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="w-full min-h-screen pt-40 text-center text-xl text-foreground/50">Loading...</div>;
  if (!product) return (
    <div className="w-full min-h-screen pt-40 pb-20 px-6 max-w-[1400px] mx-auto text-center">
      <h1 className="text-6xl font-sans font-medium mb-8">Produk tidak ditemukan.</h1>
      <Link to="/layanan" className="px-8 py-4 rounded-full border border-foreground/20 hover:border-foreground transition-all">← Kembali</Link>
    </div>
  );

  const images = [];
  if (product.images?.length > 0) {
    images.push(...product.images.map((i: any) => i.url.startsWith('http') ? i.url : `http://localhost:5000${i.url}`));
  } else if (product.imageUrl) {
    images.push(product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`);
  } else {
    images.push(`https://placehold.co/1000x1200/ffe1e8/800000?text=${encodeURIComponent(product.name)}`);
  }

  const divisi = product.divisi?.toUpperCase() ?? '';

  return (
    <div className="w-full bg-background min-h-screen pb-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12">
        {/* Back breadcrumb */}
        <Link to="/layanan" className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-primary transition-colors mb-12">
          ← Semua Layanan
        </Link>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit mx-auto w-full max-w-md lg:max-w-full">
            <motion.div key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
              className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-secondary mb-6 cursor-zoom-in group relative"
              onClick={() => setZoomedImg(images[activeImg])}>
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-contain p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              </div>
            </motion.div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img: string, idx: number) => (
                <button key={idx} onClick={() => setActiveImg(idx)}
                  className={`shrink-0 w-20 h-28 rounded-xl overflow-hidden transition-all ${activeImg === idx ? 'ring-4 ring-primary' : 'opacity-50 hover:opacity-100'}`}>
                  <img src={img} alt="" className="w-full h-full object-contain p-1 mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-7 pt-4 lg:pl-6">
            <Link to={`/layanan/${divisi.toLowerCase().replace('_', '-')}`}
              className="text-sm font-bold text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
              {divisi.replace('_', ' ')}
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-foreground mt-3 mb-6 tracking-tighter leading-[0.95]">
              {product.name}
            </h1>
            <p className="text-foreground/60 text-lg font-light leading-relaxed mb-8 border-b border-border pb-8">
              {product.description}
            </p>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 mb-8 flex justify-between items-center">
              <span className="text-sm font-bold text-foreground/60 uppercase tracking-widest">Harga Dasar (Mulai dari)</span>
              <span className="text-3xl font-extrabold text-primary">Rp {Number(product.price).toLocaleString('id-ID')}</span>
            </div>

            {/* Configurator */}
            <div className="mb-10">
              <h2 className="text-xl font-bold font-heading text-foreground uppercase tracking-widest mb-6">
                Konfigurasi Pesanan
              </h2>
              <UniversalConfigurator product={product} onAdd={() => setCartFlash(true)} />
            </div>

            {cartFlash && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center text-sm text-green-600 font-medium">
                ✓ Produk ditambahkan ke keranjang! <Link to="/cart" className="underline">Lihat keranjang →</Link>
              </motion.div>
            )}

            {/* Product Reviews */}
            <ProductReviews productId={product.id} />
            
          </div>
        </div>
      </div>

      {/* ── IMAGE ZOOM MODAL ── */}
      <AnimatePresence>
        {zoomedImg && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setZoomedImg(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-zoom-out"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-5xl max-h-[90vh] flex items-center justify-center pointer-events-none"
            >
              <img 
                src={zoomedImg} 
                alt="Zoomed product" 
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl pointer-events-auto bg-white"
              />
              <button 
                onClick={() => setZoomedImg(null)} 
                className="absolute -top-12 right-0 md:-right-12 md:top-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors pointer-events-auto"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}


