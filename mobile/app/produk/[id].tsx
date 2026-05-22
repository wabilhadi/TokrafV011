import React, { useState } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  TextInput, Alert, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Linking } from 'react-native';
import Navbar from '../../components/Navbar';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Minus, Plus, ShoppingBag, CheckCircle, MessageCircle } from 'lucide-react-native';
import { useCartStore } from '../../store/cartStore';

// ─── Dummy product catalog ───────────────────────────────────────────────────
const DUMMY_PRODUCTS: any[] = [
  { id: 'd1', name: 'Premium Oversized Hoodie', price: 250000, divisi: 'KONVEKSI', description: 'High-end heavyweight cotton hoodie with custom embroidery.', minOrder: 12, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800' },
  { id: 'd2', name: 'Canvas Totebag Aesthetic', price: 45000, divisi: 'MERCH', description: 'Durable canvas totebag with minimalist screen print.', minOrder: 50, imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800' },
  { id: 'd3', name: 'Art Print Poster A3', price: 20000, divisi: 'DIGITAL_PRINTING', description: 'Gallery-quality fine art printing on textured paper.', minOrder: 10, imageUrl: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=800' },
  { id: 'd4', name: 'Varsity Bomber Jacket', price: 350000, divisi: 'KONVEKSI', description: 'Classic collegiate style bomber jacket.', minOrder: 12, imageUrl: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=800' },
  { id: 'd5', name: 'Custom Enamel Pins', price: 15000, divisi: 'MERCH', description: 'Hard enamel pins with vibrant colors.', minOrder: 100, imageUrl: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800' },
  { id: 'd6', name: 'Standing X-Banner', price: 120000, divisi: 'DIGITAL_PRINTING', description: 'High-res outdoor/indoor banner with aluminum stand.', minOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1563690623230-0322ba6db7d4?q=80&w=800' },
  { id: 'd7', name: 'Corporate Polo Shirt', price: 110000, divisi: 'KONVEKSI', description: 'Breathable pique cotton polo.', minOrder: 24, imageUrl: 'https://images.unsplash.com/photo-1586363104862-3a5e222ee182?q=80&w=800' },
  { id: 'd8', name: 'Woven Lanyard', price: 12000, divisi: 'MERCH', description: 'Premium woven polyester lanyard.', minOrder: 50, imageUrl: 'https://images.unsplash.com/photo-1585435422896-e2603fc5c00e?q=80&w=800' },
  { id: 'd9', name: 'Packaging Box Custom', price: 8000, divisi: 'DIGITAL_PRINTING', description: 'Corrugated boxes with full-color printing.', minOrder: 100, imageUrl: 'https://images.unsplash.com/photo-1605335128031-2945d81cbcc0?q=80&w=800' },
  { id: 'd10', name: 'Kemeja PDH / Korsa', price: 160000, divisi: 'KONVEKSI', description: 'Durable drill fabric uniform.', minOrder: 24, imageUrl: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800' },
  { id: 'd11', name: 'Matte Tumbler Flask', price: 75000, divisi: 'MERCH', description: 'Vacuum insulated tumbler with laser engraving.', minOrder: 24, imageUrl: 'https://images.unsplash.com/photo-1610943640030-22cba2bd11d3?q=80&w=800' },
  { id: 'd12', name: 'Hardcover Notebook', price: 45000, divisi: 'DIGITAL_PRINTING', description: 'Premium bound notebook with custom cover.', minOrder: 50, imageUrl: 'https://images.unsplash.com/photo-1531346878377-a541e4a0ecce?q=80&w=800' },
];

// ─── Option configs ──────────────────────────────────────────────────────────
const KONVEKSI_BAHAN = ['Cotton 20s', 'Cotton 24s', 'Cotton 30s', 'Polyester', 'Drill'];
const KONVEKSI_TEKNIK = ['Sablon Manual', 'DTF', 'Bordir', 'Sublimasi'];
const KONVEKSI_UKURAN = ['S', 'M', 'L', 'XL', 'XXL'];
const PRINTING_BAHAN = ['Flexi Korea', 'Frontlite', 'Albatros', 'Sticker Vinyl', 'Canvas'];
const PRINTING_FINISHING = ['Tanpa Finishing', 'Laminasi Doff', 'Laminasi Glossy', 'Mata Ayam'];
const MERCH_TEKNIK = ['Sablon', 'DTF', 'Bordir', 'Laser Engraving'];

// ─── Reusable UI ─────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: string }) {
  return <Text className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">{children}</Text>;
}

function OptionChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}
      className={`px-4 py-2 rounded-full border mr-2 mb-2 ${selected ? 'bg-primary border-primary' : 'bg-background border-border'}`}>
      <Text className={`text-sm font-semibold ${selected ? 'text-white' : 'text-foreground/70'}`}>{label}</Text>
    </TouchableOpacity>
  );
}

function QtyRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-border">
      <Text className="font-bold text-foreground w-10">{label}</Text>
      <View className="flex-row items-center gap-x-3">
        <TouchableOpacity onPress={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 rounded-full border border-border items-center justify-center">
          <Minus size={14} color="#0A0A0A" />
        </TouchableOpacity>
        <Text className="w-8 text-center font-bold text-base">{value}</Text>
        <TouchableOpacity onPress={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-border items-center justify-center">
          <Plus size={14} color="#0A0A0A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Configurators ────────────────────────────────────────────────────────────
function KonveksiConfig({ product, onAdded }: { product: any; onAdded: () => void }) {
  const [bahan, setBahan] = useState(KONVEKSI_BAHAN[2]);
  const [teknik, setTeknik] = useState(KONVEKSI_TEKNIK[0]);
  const [sizes, setSizes] = useState<Record<string, number>>({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  const totalQty = Object.values(sizes).reduce((a, b) => a + b, 0);
  const totalPrice = Number(product.price) * totalQty;
  const sizeNote = KONVEKSI_UKURAN.filter(s => sizes[s] > 0).map(s => `${s}=${sizes[s]}`).join(', ');

  const handleAdd = () => {
    if (totalQty < product.minOrder) {
      Alert.alert('Min. Order', `Minimum order adalah ${product.minOrder} pcs. Saat ini: ${totalQty} pcs.`);
      return;
    }
    addItem({ productId: product.id, name: product.name, price: Number(product.price), quantity: totalQty, imageUrl: product.imageUrl, customOptions: { Bahan: bahan, Teknik: teknik }, customNote: `Ukuran: ${sizeNote}` });
    setAdded(true);
    setTimeout(() => { setAdded(false); onAdded(); }, 1500);
  };

  return (
    <View>
      <View className="mb-6">
        <SectionTitle>Pilih Bahan</SectionTitle>
        <View className="flex-row flex-wrap">{KONVEKSI_BAHAN.map(b => <OptionChip key={b} label={b} selected={bahan === b} onPress={() => setBahan(b)} />)}</View>
      </View>
      <View className="mb-6">
        <SectionTitle>Teknik Cetak</SectionTitle>
        <View className="flex-row flex-wrap">{KONVEKSI_TEKNIK.map(t => <OptionChip key={t} label={t} selected={teknik === t} onPress={() => setTeknik(t)} />)}</View>
      </View>
      <View className="mb-6">
        <SectionTitle>Jumlah per Ukuran (min. {product.minOrder} total)</SectionTitle>
        <View className="bg-secondary rounded-2xl px-4">
          {KONVEKSI_UKURAN.map(s => <QtyRow key={s} label={s} value={sizes[s] ?? 0} onChange={v => setSizes(p => ({ ...p, [s]: v }))} />)}
        </View>
        <View className="flex-row justify-between mt-3 px-1">
          <Text className="text-sm text-foreground/60">Total: <Text className="font-bold">{totalQty} pcs</Text></Text>
          <Text className="font-bold text-primary">Rp {totalPrice.toLocaleString('id-ID')}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleAdd}
        className={`w-full flex-row items-center justify-center gap-x-2 py-4 rounded-full border-2 ${added ? 'bg-green-500 border-green-500' : 'bg-secondary border-border'}`}>
        {added ? <CheckCircle color="#fff" size={20} /> : <ShoppingBag color="#0A0A0A" size={20} />}
        <Text className={`font-bold text-base tracking-widest ${added ? 'text-white' : 'text-foreground'}`}>{added ? 'DITAMBAHKAN!' : 'TAMBAH KE KERANJANG'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function PrintingConfig({ product, onAdded }: { product: any; onAdded: () => void }) {
  const [bahan, setBahan] = useState(PRINTING_BAHAN[0]);
  const [finishing, setFinishing] = useState(PRINTING_FINISHING[0]);
  const [lebar, setLebar] = useState('1');
  const [tinggi, setTinggi] = useState('1');
  const [qty, setQty] = useState(product.minOrder ?? 1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  const luas = (parseFloat(lebar) || 0) * (parseFloat(tinggi) || 0);
  const isBanner = ['banner', 'spanduk', 'backdrop'].some(k => product.name.toLowerCase().includes(k));
  const unitPrice = isBanner ? Number(product.price) * luas : Number(product.price);
  const totalPrice = unitPrice * qty;

  const handleAdd = () => {
    addItem({ productId: product.id, name: product.name, price: unitPrice, quantity: qty, imageUrl: product.imageUrl, customOptions: { Bahan: bahan, Finishing: finishing }, customNote: isBanner ? `Ukuran: ${lebar}m × ${tinggi}m` : undefined });
    setAdded(true);
    setTimeout(() => { setAdded(false); onAdded(); }, 1500);
  };

  return (
    <View>
      {isBanner && (
        <View className="mb-6">
          <SectionTitle>Ukuran (meter)</SectionTitle>
          <View className="flex-row gap-x-3">
            <View className="flex-1">
              <Text className="text-xs text-foreground/50 mb-1">Lebar (m)</Text>
              <TextInput value={lebar} onChangeText={setLebar} keyboardType="decimal-pad"
                className="border border-border rounded-xl px-4 py-3 bg-background text-foreground text-base" />
            </View>
            <Text className="text-2xl text-foreground/30 self-end pb-3">×</Text>
            <View className="flex-1">
              <Text className="text-xs text-foreground/50 mb-1">Tinggi (m)</Text>
              <TextInput value={tinggi} onChangeText={setTinggi} keyboardType="decimal-pad"
                className="border border-border rounded-xl px-4 py-3 bg-background text-foreground text-base" />
            </View>
          </View>
          <Text className="text-sm text-foreground/50 mt-2">Luas: <Text className="font-bold">{luas.toFixed(2)} m²</Text></Text>
        </View>
      )}
      <View className="mb-6">
        <SectionTitle>Pilih Bahan</SectionTitle>
        <View className="flex-row flex-wrap">{PRINTING_BAHAN.map(b => <OptionChip key={b} label={b} selected={bahan === b} onPress={() => setBahan(b)} />)}</View>
      </View>
      <View className="mb-6">
        <SectionTitle>Finishing</SectionTitle>
        <View className="flex-row flex-wrap">{PRINTING_FINISHING.map(f => <OptionChip key={f} label={f} selected={finishing === f} onPress={() => setFinishing(f)} />)}</View>
      </View>
      <View className="mb-6">
        <SectionTitle>Jumlah (min. {product.minOrder} pcs)</SectionTitle>
        <View className="flex-row items-center gap-x-4">
          <TouchableOpacity onPress={() => setQty(q => Math.max(product.minOrder, q - 1))} className="w-11 h-11 rounded-full border-2 border-border items-center justify-center"><Minus size={18} color="#0A0A0A" /></TouchableOpacity>
          <Text className="text-3xl font-bold w-12 text-center">{qty}</Text>
          <TouchableOpacity onPress={() => setQty(q => q + 1)} className="w-11 h-11 rounded-full border-2 border-border items-center justify-center"><Plus size={18} color="#0A0A0A" /></TouchableOpacity>
        </View>
      </View>
      <View className="bg-secondary rounded-2xl p-4 flex-row justify-between mb-6">
        <Text className="text-foreground/60">Total</Text>
        <Text className="font-bold text-primary text-lg">Rp {totalPrice.toLocaleString('id-ID')}</Text>
      </View>
      <TouchableOpacity onPress={handleAdd}
        className={`w-full flex-row items-center justify-center gap-x-2 py-4 rounded-full border-2 ${added ? 'bg-green-500 border-green-500' : 'bg-secondary border-border'}`}>
        {added ? <CheckCircle color="#fff" size={20} /> : <ShoppingBag color="#0A0A0A" size={20} />}
        <Text className={`font-bold text-base tracking-widest ${added ? 'text-white' : 'text-foreground'}`}>{added ? 'DITAMBAHKAN!' : 'TAMBAH KE KERANJANG'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function MerchConfig({ product, onAdded }: { product: any; onAdded: () => void }) {
  const [teknik, setTeknik] = useState(MERCH_TEKNIK[0]);
  const [qty, setQty] = useState(product.minOrder ?? 1);
  const [note, setNote] = useState('');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  const totalPrice = Number(product.price) * qty;

  const handleAdd = () => {
    addItem({ productId: product.id, name: product.name, price: Number(product.price), quantity: qty, imageUrl: product.imageUrl, customOptions: { Teknik: teknik }, customNote: note || undefined });
    setAdded(true);
    setTimeout(() => { setAdded(false); onAdded(); }, 1500);
  };

  return (
    <View>
      <View className="mb-6">
        <SectionTitle>Teknik Produksi</SectionTitle>
        <View className="flex-row flex-wrap">{MERCH_TEKNIK.map(t => <OptionChip key={t} label={t} selected={teknik === t} onPress={() => setTeknik(t)} />)}</View>
      </View>
      <View className="mb-6">
        <SectionTitle>Jumlah (min. {product.minOrder} pcs)</SectionTitle>
        <View className="flex-row items-center gap-x-4">
          <TouchableOpacity onPress={() => setQty(q => Math.max(product.minOrder, q - 1))} className="w-11 h-11 rounded-full border-2 border-border items-center justify-center"><Minus size={18} color="#0A0A0A" /></TouchableOpacity>
          <Text className="text-3xl font-bold w-12 text-center">{qty}</Text>
          <TouchableOpacity onPress={() => setQty(q => q + 1)} className="w-11 h-11 rounded-full border-2 border-border items-center justify-center"><Plus size={18} color="#0A0A0A" /></TouchableOpacity>
        </View>
      </View>
      <View className="mb-6">
        <SectionTitle>Catatan Tambahan</SectionTitle>
        <TextInput multiline numberOfLines={3} value={note} onChangeText={setNote}
          placeholder="Warna, desain, atau detail lainnya..."
          placeholderTextColor="#999"
          className="border border-border rounded-2xl px-4 py-3 bg-background text-foreground text-base"
          style={{ textAlignVertical: 'top', minHeight: 80 }}
        />
      </View>
      <View className="bg-secondary rounded-2xl p-4 flex-row justify-between mb-6">
        <Text className="text-foreground/60">Total</Text>
        <Text className="font-bold text-primary text-lg">Rp {totalPrice.toLocaleString('id-ID')}</Text>
      </View>
      <TouchableOpacity onPress={handleAdd}
        className={`w-full flex-row items-center justify-center gap-x-2 py-4 rounded-full border-2 ${added ? 'bg-green-500 border-green-500' : 'bg-secondary border-border'}`}>
        {added ? <CheckCircle color="#fff" size={20} /> : <ShoppingBag color="#0A0A0A" size={20} />}
        <Text className={`font-bold text-base tracking-widest ${added ? 'text-white' : 'text-foreground'}`}>{added ? 'DITAMBAHKAN!' : 'TAMBAH KE KERANJANG'}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [cartFlash, setCartFlash] = useState(false);

  const product = DUMMY_PRODUCTS.find(p => p.id === id) ?? DUMMY_PRODUCTS[0];
  const divisi = (product.divisi ?? '').toUpperCase();

  const handleWA = () => {
    const msg = encodeURIComponent(`Halo Admin TOKRAF! Saya tertarik memesan *${product.name}*. Bisa info lebih lanjut?`);
    Linking.openURL(`https://wa.me/6281993294170?text=${msg}`);
  };

  return (
    <View className="flex-1 bg-background">
      <Navbar />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120, paddingTop: 90 }} showsVerticalScrollIndicator={false}>

        {/* Hero Image */}
        <Animated.View entering={FadeInUp.duration(500)} className="mx-4 mb-6 rounded-3xl overflow-hidden" style={{ aspectRatio: 4 / 3 }}>
          <Image source={{ uri: product.imageUrl }} className="w-full h-full" resizeMode="cover" />
          <TouchableOpacity onPress={() => router.back()}
            className="absolute top-4 left-4 w-10 h-10 bg-black/30 rounded-full items-center justify-center">
            <ArrowLeft color="#fff" size={20} />
          </TouchableOpacity>
        </Animated.View>

        <View className="px-5">
          {/* Header */}
          <Animated.View entering={FadeInUp.delay(100).duration(500)} className="mb-6">
            <Text className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{divisi.replace('_', ' ')}</Text>
            <Text className="text-3xl font-extrabold text-foreground leading-tight mb-3">{product.name}</Text>
            <Text className="text-foreground/60 text-base leading-relaxed mb-4">{product.description}</Text>
            <View className="bg-primary/10 border border-primary/20 rounded-2xl px-5 py-3 flex-row justify-between items-center">
              <Text className="text-sm text-foreground/60 font-semibold">Mulai dari</Text>
              <Text className="text-xl font-extrabold text-primary">Rp {Number(product.price).toLocaleString('id-ID')}</Text>
            </View>
          </Animated.View>

          {/* Configurator */}
          <Animated.View entering={FadeInUp.delay(200).duration(500)} className="mb-8">
            <Text className="text-lg font-extrabold text-foreground uppercase tracking-widest mb-5">Konfigurasi Pesanan</Text>
            {divisi === 'KONVEKSI'
              ? <KonveksiConfig product={product} onAdded={() => setCartFlash(true)} />
              : divisi === 'DIGITAL_PRINTING'
              ? <PrintingConfig product={product} onAdded={() => setCartFlash(true)} />
              : <MerchConfig product={product} onAdded={() => setCartFlash(true)} />
            }
          </Animated.View>

          {cartFlash && (
            <Animated.View entering={FadeInUp.duration(300)} className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 flex-row items-center gap-x-3">
              <CheckCircle color="#16a34a" size={20} />
              <Text className="text-green-800 font-semibold flex-1">Produk ditambahkan ke keranjang!</Text>
              <TouchableOpacity onPress={() => router.push('/cart')}>
                <Text className="text-green-700 font-bold text-sm">Lihat →</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* WhatsApp Direct */}
          <TouchableOpacity onPress={handleWA}
            className="w-full flex-row items-center justify-center gap-x-3 py-4 rounded-full bg-primary mb-8">
            <MessageCircle color="#fff" size={22} />
            <Text className="text-white font-bold text-base tracking-widest">PESAN VIA WHATSAPP</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
