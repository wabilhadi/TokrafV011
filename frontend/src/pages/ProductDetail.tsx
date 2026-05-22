import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { ShoppingBag, CheckCircle, Minus, Plus } from 'lucide-react';
import { TOKRAF_PRODUCTS } from '../lib/products';

// ─── Default fallbacks (used when DB has no options yet) ────────────────────

const DEFAULT_KONVEKSI = {
  bahan: ['Cotton Combed 20s', 'Cotton Combed 24s', 'Cotton Combed 30s', 'Polyester', 'Drill', 'Oxford'],
  teknik: ['Sablon Manual', 'DTF (Direct to Film)', 'Bordir', 'Sublimasi'],
  ukuran: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
};

const DEFAULT_PRINTING = {
  bahan: ['Flexi Korea', 'Frontlite', 'Albatros', 'Luster', 'Canvas', 'Sticker Vinyl'],
  finishing: ['Tanpa Finishing', 'Laminasi Doff', 'Laminasi Glossy', 'Mata Ayam', 'Cutting Shape'],
};

const DEFAULT_MERCH = {
  teknik: ['Sablon', 'DTF', 'Bordir', 'Laser Engraving', 'UV Printing'],
};

// Helper: get option values from API or fall back to default
function getOptionValues(apiOptions: any[], name: string, fallback: string[]): string[] {
  const found = apiOptions?.find((o: any) => o.name.toLowerCase() === name.toLowerCase());
  return found ? found.values.split(',').map((v: string) => v.trim()) : fallback;
}

// Produk nyata TOKRAF dari katalog (fallback tanpa backend)
const DUMMY_PRODUCTS: any[] = TOKRAF_PRODUCTS;
ort { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { ShoppingBag, CheckCircle, Minus, Plus } from 'lucide-react';
import { TOKRAF_PRODUCTS } from '../lib/products';

// ─── Default fallbacks (used when DB has no options yet) ────────────────────

const DEFAULT_KONVEKSI = {
  bahan: ['Cotton Combed 20s', 'Cotton Combed 24s', 'Cotton Combed 30s', 'Polyester', 'Drill', 'Oxford'],
  teknik: ['Sablon Manual', 'DTF (Direct to Film)', 'Bordir', 'Sublimasi'],
  ukuran: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
};

const DEFAULT_PRINTING = {
  bahan: ['Flexi Korea', 'Frontlite', 'Albatros', 'Luster', 'Canvas', 'Sticker Vinyl'],
  finishing: ['Tanpa Finishing', 'Laminasi Doff', 'Laminasi Glossy', 'Mata Ayam', 'Cutting Shape'],
};

const DEFAULT_MERCH = {
  teknik: ['Sablon', 'DTF', 'Bordir', 'Laser Engraving', 'UV Printing'],
};

// Helper: get option values from API or fall back to default
function getOptionValues(apiOptions: any[], name: string, fallback: string[]): string[] {
  const found = apiOptions?.find((o: any) => o.name.toLowerCase() === name.toLowerCase());
  return found ? found.values.split(',').map((v: string) => v.trim()) : fallback;
}

// ─── Dummy Data ──────────────────────────────────────────────────────────────

const DUMMY_PRODUCTS: any[] = [
  { id: 'd1', name: 'Premium Oversized Hoodie', price: 250000, divisi: 'KONVEKSI', description: 'High-end heavyweight cotton hoodie with custom embroidery.', minOrder: 12, images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200' }] },
  { id: 'd2', name: 'Canvas Totebag Aesthetic', price: 45000, divisi: 'MERCH', description: 'Durable canvas totebag with minimalist screen print.', minOrder: 50, images: [{ url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200' }] },
  { id: 'd3', name: 'Art Print Poster A3', price: 20000, divisi: 'DIGITAL_PRINTING', description: 'Gallery-quality fine art printing on textured paper.', minOrder: 10, images: [{ url: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=1200' }] },
  { id: 'd4', name: 'Varsity Bomber Jacket', price: 350000, divisi: 'KONVEKSI', description: 'Classic collegiate style bomber jacket with leather sleeves.', minOrder: 12, images: [{ url: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=1200' }] },
  { id: 'd5', name: 'Custom Enamel Pins', price: 15000, divisi: 'MERCH', description: 'Hard enamel pins with vibrant colors and metal plating.', minOrder: 100, images: [{ url: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200' }] },
  { id: 'd6', name: 'Standing X-Banner', price: 120000, divisi: 'DIGITAL_PRINTING', description: 'High-res outdoor/indoor banner with aluminum stand.', minOrder: 1, images: [{ url: 'https://images.unsplash.com/photo-1563690623230-0322ba6db7d4?q=80&w=1200' }] },
  { id: 'd7', name: 'Corporate Polo Shirt', price: 110000, divisi: 'KONVEKSI', description: 'Breathable pique cotton polo with company logo.', minOrder: 24, images: [{ url: 'https://images.unsplash.com/photo-1586363104862-3a5e222ee182?q=80&w=1200' }] },
  { id: 'd8', name: 'Woven Lanyard', price: 12000, divisi: 'MERCH', description: 'Premium woven polyester lanyard with metal hook.', minOrder: 50, images: [{ url: 'https://images.unsplash.com/photo-1585435422896-e2603fc5c00e?q=80&w=1200' }] },
  { id: 'd9', name: 'Packaging Box Custom', price: 8000, divisi: 'DIGITAL_PRINTING', description: 'Corrugated boxes with full-color brand printing.', minOrder: 100, images: [{ url: 'https://images.unsplash.com/photo-1605335128031-2945d81cbcc0?q=80&w=1200' }] },
  { id: 'd10', name: 'Kemeja PDH / Korsa', price: 160000, divisi: 'KONVEKSI', description: 'Durable drill fabric uniform for organizations.', minOrder: 24, images: [{ url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200' }] },
  { id: 'd11', name: 'Matte Tumbler Flask', price: 75000, divisi: 'MERCH', description: 'Vacuum insulated tumbler with laser engraving.', minOrder: 24, images: [{ url: 'https://images.unsplash.com/photo-1610943640030-22cba2bd11d3?q=80&w=1200' }] },
  { id: 'd12', name: 'Hardcover Notebook', price: 45000, divisi: 'DIGITAL_PRINTING', description: 'Premium bound notebook with custom cover design.', minOrder: 50, images: [{ url: 'https://images.unsplash.com/photo-1531346878377-a541e4a0ecce?q=80&w=1200' }] },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

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

function SizeRow({ size, value, onChange }: { size: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="font-bold text-foreground w-12">{size}</span>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(0, value - 1))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all">
          <Minus size={14} />
        </button>
        <span className="w-8 text-center font-bold">{value}</span>
        <button onClick={() => onChange(value + 1)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Configurator Components ─────────────────────────────────────────────────

function KonveksiConfigurator({ product, onAdd }: { product: any; onAdd: () => void }) {
  const apiOptions = product.options ?? [];
  const bahanList  = getOptionValues(apiOptions, 'Bahan',       DEFAULT_KONVEKSI.bahan);
  const teknikList = getOptionValues(apiOptions, 'Teknik',      DEFAULT_KONVEKSI.teknik);
  const ukuranList = getOptionValues(apiOptions, 'Ukuran',      DEFAULT_KONVEKSI.ukuran);
  const [bahan, setBahan] = useState(bahanList[0]);
  const [teknik, setTeknik] = useState(teknikList[0]);
  const [sizes, setSizes] = useState<Record<string, number>>(Object.fromEntries(ukuranList.map(u => [u, 0])));
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  const totalQty = Object.values(sizes).reduce((a, b) => a + b, 0);
  const sizeNote = ukuranList
    .filter(s => sizes[s] > 0)
    .map(s => `${s}=${sizes[s]}`)
    .join(', ');

  const handleAdd = () => {
    if (totalQty < product.minOrder) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: totalQty,
      imageUrl: product.images?.[0]?.url,
      customOptions: { Bahan: bahan, Teknik: teknik },
      customNote: `Ukuran: ${sizeNote}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    onAdd();
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Pilih Bahan</h3>
        <div className="flex flex-wrap gap-2">
          {bahanList.map(b => <OptionPill key={b} label={b} selected={bahan === b} onClick={() => setBahan(b)} />)}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Teknik Cetak</h3>
        <div className="flex flex-wrap gap-2">
          {teknikList.map(t => <OptionPill key={t} label={t} selected={teknik === t} onClick={() => setTeknik(t)} />)}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Jumlah per Ukuran</h3>
        <div className="bg-secondary rounded-2xl p-4">
          {ukuranList.map(s => (
            <SizeRow key={s} size={s} value={sizes[s] ?? 0} onChange={v => setSizes(prev => ({ ...prev, [s]: v }))} />
          ))}
        </div>
        <div className="flex justify-between items-center mt-3 px-1">
          <span className="text-sm text-foreground/60">Total: <strong>{totalQty} pcs</strong> (min. {product.minOrder})</span>
          <span className="font-bold text-primary">Rp {(Number(product.price) * totalQty).toLocaleString('id-ID')}</span>
        </div>
      </div>
      <button
        onClick={handleAdd}
        disabled={totalQty < product.minOrder}
        className={`w-full flex items-center justify-center gap-3 py-5 rounded-full font-bold text-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
          added ? 'bg-green-500 border-green-500 text-white' :
          totalQty < product.minOrder ? 'bg-secondary border-border text-foreground/40 cursor-not-allowed' :
          'bg-secondary border-border text-foreground hover:border-primary hover:text-primary'
        }`}
      >
        {added ? <><CheckCircle size={22} /> Ditambahkan!</> : <><ShoppingBag size={22} /> Tambah ke Keranjang</>}
      </button>
    </div>
  );
}

function PrintingConfigurator({ product, onAdd }: { product: any; onAdd: () => void }) {
  const apiOptions   = product.options ?? [];
  const bahanList    = getOptionValues(apiOptions, 'Bahan',     DEFAULT_PRINTING.bahan);
  const finishList   = getOptionValues(apiOptions, 'Finishing', DEFAULT_PRINTING.finishing);
  const [bahan, setBahan] = useState(bahanList[0]);
  const [finishing, setFinishing] = useState(finishList[0]);
  const [lebar, setLebar] = useState(1);
  const [tinggi, setTinggi] = useState(1);
  const [qty, setQty] = useState(product.minOrder ?? 1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  // Price per m² (base), recalculate for banner-type products
  const luas = lebar * tinggi;
  const isBanner = ['Banner', 'Spanduk', 'X-Banner', 'Backdrop'].some(k =>
    product.name.toLowerCase().includes(k.toLowerCase())
  );
  const unitPrice = isBanner
    ? Number(product.price) * luas
    : Number(product.price);
  const totalPrice = unitPrice * qty;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: unitPrice,
      quantity: qty,
      imageUrl: product.images?.[0]?.url,
      customOptions: { Bahan: bahan, Finishing: finishing },
      customNote: isBanner ? `Ukuran: ${lebar}m × ${tinggi}m (${luas}m²)` : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    onAdd();
  };

  return (
    <div className="space-y-8">
      {isBanner && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Ukuran (meter)</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-foreground/60 mb-1 block">Lebar (m)</label>
              <input type="number" min={0.1} step={0.1} value={lebar}
                onChange={e => setLebar(Number(e.target.value))}
                className="w-full border border-border rounded-xl px-4 py-3 bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <span className="text-2xl text-foreground/40 mt-4">×</span>
            <div className="flex-1">
              <label className="text-xs text-foreground/60 mb-1 block">Tinggi (m)</label>
              <input type="number" min={0.1} step={0.1} value={tinggi}
                onChange={e => setTinggi(Number(e.target.value))}
                className="w-full border border-border rounded-xl px-4 py-3 bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
          <p className="text-sm text-foreground/60 mt-2">Luas: <strong>{luas.toFixed(2)} m²</strong></p>
        </div>
      )}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Pilih Bahan</h3>
        <div className="flex flex-wrap gap-2">
          {bahanList.map(b => <OptionPill key={b} label={b} selected={bahan === b} onClick={() => setBahan(b)} />)}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Finishing</h3>
        <div className="flex flex-wrap gap-2">
          {finishList.map(f => <OptionPill key={f} label={f} selected={finishing === f} onClick={() => setFinishing(f)} />)}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Jumlah (pcs)</h3>
        <div className="flex items-center gap-4">
          <button onClick={() => setQty(q => Math.max(product.minOrder, q - 1))} className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all">
            <Minus size={18} />
          </button>
          <span className="text-3xl font-bold w-16 text-center">{qty}</span>
          <button onClick={() => setQty(q => q + 1)} className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all">
            <Plus size={18} />
          </button>
        </div>
        <p className="text-sm text-foreground/60 mt-2">Min. order: {product.minOrder} pcs</p>
      </div>
      <div className="bg-secondary rounded-2xl p-5 flex justify-between items-center">
        <span className="text-foreground/70">Total Harga</span>
        <span className="text-2xl font-bold text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
      </div>
      <button onClick={handleAdd}
        className={`w-full flex items-center justify-center gap-3 py-5 rounded-full font-bold text-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
          added ? 'bg-green-500 border-green-500 text-white' : 'bg-secondary border-border text-foreground hover:border-primary hover:text-primary'
        }`}
      >
        {added ? <><CheckCircle size={22} /> Ditambahkan!</> : <><ShoppingBag size={22} /> Tambah ke Keranjang</>}
      </button>
    </div>
  );
}

function MerchConfigurator({ product, onAdd }: { product: any; onAdd: () => void }) {
  const apiOptions = product.options ?? [];
  const teknikList = getOptionValues(apiOptions, 'Teknik', DEFAULT_MERCH.teknik);
  const [teknik, setTeknik] = useState(teknikList[0]);
  const [qty, setQty] = useState(product.minOrder ?? 1);
  const [note, setNote] = useState('');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  const totalPrice = Number(product.price) * qty;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: qty,
      imageUrl: product.images?.[0]?.url,
      customOptions: { Teknik: teknik },
      customNote: note || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    onAdd();
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Teknik Produksi</h3>
        <div className="flex flex-wrap gap-2">
          {MERCH_OPTIONS.teknik.map(t => <OptionPill key={t} label={t} selected={teknik === t} onClick={() => setTeknik(t)} />)}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Jumlah (pcs)</h3>
        <div className="flex items-center gap-4">
          <button onClick={() => setQty(q => Math.max(product.minOrder, q - 1))} className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all">
            <Minus size={18} />
          </button>
          <span className="text-3xl font-bold w-16 text-center">{qty}</span>
          <button onClick={() => setQty(q => q + 1)} className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all">
            <Plus size={18} />
          </button>
        </div>
        <p className="text-sm text-foreground/60 mt-2">Min. order: {product.minOrder} pcs</p>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Catatan Tambahan</h3>
        <textarea
          rows={3}
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Misal: warna produk hitam, desain logo di tengah..."
          className="w-full border border-border rounded-2xl px-4 py-3 bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none"
        />
      </div>
      <div className="bg-secondary rounded-2xl p-5 flex justify-between items-center">
        <span className="text-foreground/70">Total Harga</span>
        <span className="text-2xl font-bold text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
      </div>
      <button onClick={handleAdd}
        className={`w-full flex items-center justify-center gap-3 py-5 rounded-full font-bold text-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
          added ? 'bg-green-500 border-green-500 text-white' : 'bg-secondary border-border text-foreground hover:border-primary hover:text-primary'
        }`}
      >
        {added ? <><CheckCircle size={22} /> Ditambahkan!</> : <><ShoppingBag size={22} /> Tambah ke Keranjang</>}
      </button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [cartFlash, setCartFlash] = useState(false);

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

  const images = product.images?.length > 0
    ? product.images.map((i: any) => i.url)
    : [`https://placehold.co/1000x1200/ffe1e8/800000?text=${encodeURIComponent(product.name)}`];

  const divisi = product.divisi?.toUpperCase() ?? '';

  const handleWAOrder = () => {
    const text = encodeURIComponent(`Halo Admin TOKRAF! Saya tertarik memesan *${product.name}*. Bisa info lebih lanjut?`);
    window.open(`https://wa.me/6281993294170?text=${text}`, '_blank');
  };

  return (
    <div className="w-full bg-background min-h-screen pb-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12">
        {/* Back breadcrumb */}
        <Link to="/layanan" className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-primary transition-colors mb-12">
          ← Semua Layanan
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Gallery */}
          <div className="lg:sticky lg:top-32 h-fit">
            <motion.div key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
              className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-secondary mb-6">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img: string, idx: number) => (
                <button key={idx} onClick={() => setActiveImg(idx)}
                  className={`shrink-0 w-20 h-28 rounded-xl overflow-hidden transition-all ${activeImg === idx ? 'ring-4 ring-primary' : 'opacity-50 hover:opacity-100'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="pt-4">
            <Link to={`/layanan/${divisi.toLowerCase().replace('_', '-')}`}
              className="text-sm font-bold text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
              {divisi.replace('_', ' ')}
            </Link>
            <h1 className="text-5xl md:text-6xl font-extrabold font-heading text-foreground mt-3 mb-6 tracking-tighter leading-[0.95]">
              {product.name}
            </h1>
            <p className="text-foreground/60 text-lg font-light leading-relaxed mb-8 border-b border-border pb-8">
              {product.description}
            </p>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 mb-8 flex justify-between items-center">
              <span className="text-sm font-bold text-foreground/60 uppercase tracking-widest">Mulai dari</span>
              <span className="text-3xl font-extrabold text-primary">Rp {Number(product.price).toLocaleString('id-ID')}</span>
            </div>

            {/* Configurator */}
            <div className="mb-10">
              <h2 className="text-xl font-bold font-heading text-foreground uppercase tracking-widest mb-6">
                Konfigurasi Pesanan
              </h2>
              {divisi === 'KONVEKSI'
                ? <KonveksiConfigurator product={product} onAdd={() => setCartFlash(true)} />
                : divisi === 'DIGITAL_PRINTING'
                ? <PrintingConfigurator product={product} onAdd={() => setCartFlash(true)} />
                : <MerchConfigurator product={product} onAdd={() => setCartFlash(true)} />
              }
            </div>

            <button onClick={handleWAOrder}
              className="w-full block text-center bg-primary text-white font-heading font-bold text-xl py-5 rounded-full hover:bg-foreground hover:scale-[1.02] active:scale-[0.98] transition-all">
              💬 Pesan Langsung via WhatsApp
            </button>

            {cartFlash && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center text-sm text-green-600 font-medium">
                ✓ Produk ditambahkan ke keranjang! <Link to="/cart" className="underline">Lihat keranjang →</Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
