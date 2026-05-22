import React, { useState, useMemo } from 'react';
import { TOKRAF_PRODUCTS } from '../../lib/products';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  TextInput, Alert, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking } from 'react-native';
import Navbar from '../../components/Navbar';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Minus, Plus, ShoppingBag, CheckCircle, MessageCircle } from 'lucide-react-native';
import { useCartStore } from '../../store/cartStore';

const DUMMY_PRODUCTS: any[] = TOKRAF_PRODUCTS;
const TOKRAF_WA = '6281993294170';

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Parse price from option label like "Model Spin (Rp 38.000)" → 38000
function parsePriceFromLabel(label: string): number | null {
  const match = label.match(/Rp\s?([\d.,]+)/);
  if (!match) return null;
  return parseInt(match[1].replace(/[.,]/g, ''), 10) || null;
}

// Get list from product options or fallback
function getOptions(product: any, name: string, fallback: string[]): string[] {
  const found = product?.options?.find((o: any) =>
    o.name.toLowerCase().includes(name.toLowerCase())
  );
  if (!found) return fallback;
  return found.values.split(',').map((v: string) => v.trim());
}

// ─── Reusable UI ─────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: string }) {
  return <Text className="text-xs font-bold uppercase tracking-widest text-primary mb-3 opacity-60">{children}</Text>;
}

function OptionChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full border mr-2 mb-2 ${selected ? 'bg-primary border-primary' : 'bg-background border-border'}`}
    >
      <Text className={`text-sm font-semibold ${selected ? 'text-white' : 'text-foreground/70'}`}>{label}</Text>
    </TouchableOpacity>
  );
}

function QtyRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-border">
      <Text className="font-bold text-foreground w-12">{label}</Text>
      <View className="flex-row items-center gap-x-3">
        <TouchableOpacity onPress={() => onChange(Math.max(0, value - 1))} className="w-8 h-8 rounded-full border border-border items-center justify-center">
          <Minus size={14} color="#800000" />
        </TouchableOpacity>
        <Text className="w-8 text-center font-bold text-base">{value}</Text>
        <TouchableOpacity onPress={() => onChange(value + 1)} className="w-8 h-8 rounded-full border border-border items-center justify-center">
          <Plus size={14} color="#800000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AddButton({ onPress, added, disabled }: { onPress: () => void; added: boolean; disabled?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`w-full flex-row items-center justify-center gap-x-2 py-4 rounded-full border-2 mt-2
        ${added ? 'bg-green-500 border-green-500'
          : disabled ? 'bg-secondary border-border opacity-50'
          : 'bg-secondary border-border'}`}
    >
      {added ? <CheckCircle color="#fff" size={20} /> : <ShoppingBag color="#800000" size={20} />}
      <Text className={`font-bold text-base tracking-widest ${added ? 'text-white' : 'text-foreground'}`}>
        {added ? 'DITAMBAHKAN!' : disabled ? 'MIN. ORDER BELUM TERCAPAI' : 'TAMBAH KE KERANJANG'}
      </Text>
    </TouchableOpacity>
  );
}

// ─── KONVEKSI Configurator ────────────────────────────────────────────────────
function KonveksiConfig({ product, onAdded }: { product: any; onAdded: () => void }) {
  const bahanList  = getOptions(product, 'Bahan',  ['Cotton Combed 20s','Cotton Combed 24s','Cotton Combed 30s','Bamboo','Galaxy']);
  const teknikList = getOptions(product, 'Teknik', ['Rubber','Plastisol','Discharge','Glow in The Dark','High Density (HD)']);
  const ukuranList = getOptions(product, 'Ukuran', ['S','M','L','XL','XXL','XXXL','4XL']);
  const potonganList = getOptions(product, 'Potongan', ['Regular','Oversize','Panjang Muslimah','Raglan']);
  const tambahanList = getOptions(product, 'Tambahan', []);

  const [bahan, setBahan] = useState(bahanList[0]);
  const [teknik, setTeknik] = useState(teknikList[0]);
  const [potongan, setPotongan] = useState(potonganList[0]);
  const [tambahan, setTambahan] = useState(tambahanList[0] ?? '');
  const [sizes, setSizes] = useState<Record<string, number>>(
    Object.fromEntries(ukuranList.map(u => [u, 0]))
  );
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  // Price from option label if it has an extra
  const bahanExtra = parsePriceFromLabel(bahan) ?? 0;
  const teknikExtra = parsePriceFromLabel(teknik) ?? 0;
  const totalQty = Object.values(sizes).reduce((a, b) => a + b, 0);
  const unitPrice = Number(product.price) + bahanExtra + teknikExtra;
  const totalPrice = unitPrice * totalQty;
  const sizeNote = ukuranList.filter(s => sizes[s] > 0).map(s => `${s}:${sizes[s]}`).join(', ');

  const handleAdd = () => {
    if (totalQty < (product.minOrder ?? 12)) {
      Alert.alert('Min. Order', `Minimum order ${product.minOrder ?? 12} pcs. Saat ini: ${totalQty} pcs.`);
      return;
    }
    addItem({
      productId: product.id, name: product.name,
      price: unitPrice, quantity: totalQty,
      imageUrl: product.imageUrl,
      customOptions: { Bahan: bahan, Teknik: teknik, Potongan: potongan },
      customNote: `Ukuran: ${sizeNote}`,
    });
    setAdded(true);
    setTimeout(() => { setAdded(false); onAdded(); }, 1500);
  };

  return (
    <View>
      <View className="mb-5">
        <SectionTitle>Pilih Bahan</SectionTitle>
        <View className="flex-row flex-wrap">{bahanList.map(b => <OptionChip key={b} label={b} selected={bahan===b} onPress={()=>setBahan(b)} />)}</View>
      </View>
      <View className="mb-5">
        <SectionTitle>Teknik Sablon</SectionTitle>
        <View className="flex-row flex-wrap">{teknikList.map(t => <OptionChip key={t} label={t} selected={teknik===t} onPress={()=>setTeknik(t)} />)}</View>
      </View>
      {potonganList.length > 0 && (
        <View className="mb-5">
          <SectionTitle>Potongan / Model</SectionTitle>
          <View className="flex-row flex-wrap">{potonganList.map(p => <OptionChip key={p} label={p} selected={potongan===p} onPress={()=>setPotongan(p)} />)}</View>
        </View>
      )}
      {tambahanList.length > 0 && (
        <View className="mb-5">
          <SectionTitle>Tambahan</SectionTitle>
          <View className="flex-row flex-wrap">{tambahanList.map(t => <OptionChip key={t} label={t} selected={tambahan===t} onPress={()=>setTambahan(t)} />)}</View>
        </View>
      )}
      <View className="mb-5">
        <SectionTitle>Jumlah per Ukuran (min. {product.minOrder ?? 12} total)</SectionTitle>
        <View className="bg-secondary rounded-2xl px-4">
          {ukuranList.map(s => <QtyRow key={s} label={s} value={sizes[s]??0} onChange={v=>setSizes(p=>({...p,[s]:v}))} />)}
        </View>
        <View className="flex-row justify-between mt-3 px-1">
          <Text className="text-sm text-foreground/60">Total: <Text className="font-bold text-foreground">{totalQty} pcs</Text></Text>
          <Text className="font-bold text-primary text-lg">Rp {totalPrice.toLocaleString('id-ID')}</Text>
        </View>
        <Text className="text-xs text-foreground/40 mt-1 px-1">Harga/pcs: Rp {unitPrice.toLocaleString('id-ID')}</Text>
      </View>
      <AddButton onPress={handleAdd} added={added} disabled={totalQty < (product.minOrder ?? 12)} />
    </View>
  );
}

// ─── MERCH Configurator ────────────────────────────────────────────────────────
function MerchConfig({ product, onAdded }: { product: any; onAdded: () => void }) {
  // Get the primary option list (could be Model, Tipe, etc.)
  const primaryOptDef = product?.options?.[0];
  const primaryList = primaryOptDef
    ? primaryOptDef.values.split(',').map((v: string) => v.trim())
    : ['Standar'];
  const primaryName = primaryOptDef?.name ?? 'Model';

  // Second option (e.g. warna dalam, cetak, jumlah)
  const secondOptDef = product?.options?.[1];
  const secondList = secondOptDef
    ? secondOptDef.values.split(',').map((v: string) => v.trim())
    : [];
  const secondName = secondOptDef?.name ?? '';

  const [primarySel, setPrimarySel] = useState(primaryList[0]);
  const [secondSel, setSecondSel] = useState(secondList[0] ?? '');
  const [qty, setQty] = useState(product.minOrder ?? 1);
  const [note, setNote] = useState('');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  // Reactive price: parse from selected option label
  const parsedPrice = parsePriceFromLabel(primarySel);
  const unitPrice = parsedPrice ?? Number(product.price);
  const totalPrice = unitPrice * qty;

  const handleAdd = () => {
    const opts: Record<string, string> = { [primaryName]: primarySel };
    if (secondSel) opts[secondName] = secondSel;
    addItem({
      productId: product.id, name: product.name,
      price: unitPrice, quantity: qty,
      imageUrl: product.imageUrl,
      customOptions: opts,
      customNote: note || undefined,
    });
    setAdded(true);
    setTimeout(() => { setAdded(false); onAdded(); }, 1500);
  };

  return (
    <View>
      <View className="mb-5">
        <SectionTitle>{primaryName}</SectionTitle>
        <View className="flex-row flex-wrap">{primaryList.map((p: string) => <OptionChip key={p} label={p} selected={primarySel===p} onPress={()=>setPrimarySel(p)} />)}</View>
        {parsedPrice && <Text className="text-xs text-primary mt-1">Harga: Rp {parsedPrice.toLocaleString('id-ID')}/pcs</Text>}
      </View>
      {secondList.length > 0 && (
        <View className="mb-5">
          <SectionTitle>{secondName}</SectionTitle>
          <View className="flex-row flex-wrap">{secondList.map((s: string) => <OptionChip key={s} label={s} selected={secondSel===s} onPress={()=>setSecondSel(s)} />)}</View>
        </View>
      )}
      <View className="mb-5">
        <SectionTitle>Jumlah (min. {product.minOrder ?? 1} pcs)</SectionTitle>
        <View className="flex-row items-center gap-x-4">
          <TouchableOpacity onPress={() => setQty(q => Math.max(product.minOrder??1, q-1))} className="w-11 h-11 rounded-full border-2 border-border items-center justify-center">
            <Minus size={18} color="#800000" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold w-14 text-center">{qty}</Text>
          <TouchableOpacity onPress={() => setQty(q => q+1)} className="w-11 h-11 rounded-full border-2 border-border items-center justify-center">
            <Plus size={18} color="#800000" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="mb-5">
        <SectionTitle>Catatan (Opsional)</SectionTitle>
        <TextInput
          value={note} onChangeText={setNote} multiline numberOfLines={3}
          placeholder="Misal: warna hitam, logo di dada kiri..."
          placeholderTextColor="#999"
          className="border border-border rounded-2xl px-4 py-3 bg-secondary text-foreground text-sm"
          textAlignVertical="top"
        />
      </View>
      <View className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex-row justify-between mb-4">
        <Text className="text-foreground/60">Total Harga</Text>
        <Text className="font-bold text-primary text-lg">Rp {totalPrice.toLocaleString('id-ID')}</Text>
      </View>
      <AddButton onPress={handleAdd} added={added} />
    </View>
  );
}

// ─── DIGITAL PRINTING Configurator ────────────────────────────────────────────
function PrintingConfig({ product, onAdded }: { product: any; onAdded: () => void }) {
  const bahanList    = getOptions(product, 'Bahan',     ['280 gsm','340 gsm','440 gsm']);
  const finishList   = getOptions(product, 'Finishing', ['Tanpa Finishing','Seaming','Kolong','Keling']);

  const [bahan, setBahan]       = useState(bahanList[0]);
  const [finishing, setFinishing] = useState(finishList[0]);
  const [lebar, setLebar]         = useState('1');
  const [tinggi, setTinggi]       = useState('1');
  const [qty, setQty]             = useState(product.minOrder ?? 1);
  const [added, setAdded]         = useState(false);
  const addItem = useCartStore(s => s.addItem);

  // Check if banner (per m²) or fixed unit price
  const isBanner = ['banner','spanduk','backdrop','indoor','poster','x-banner','roll up','y-banner']
    .some(k => product.name.toLowerCase().includes(k));

  // Reactive: parse price from selected bahan option label
  const parsedBahanPrice = parsePriceFromLabel(bahan);
  const basePrice = parsedBahanPrice ?? Number(product.price);

  const luas = (parseFloat(lebar)||0) * (parseFloat(tinggi)||0);
  const unitPrice = isBanner ? basePrice * luas : basePrice;
  const totalPrice = unitPrice * qty;

  const handleAdd = () => {
    addItem({
      productId: product.id, name: product.name,
      price: unitPrice, quantity: qty,
      imageUrl: product.imageUrl,
      customOptions: { Bahan: bahan, Finishing: finishing },
      customNote: isBanner ? `Ukuran: ${lebar}m × ${tinggi}m (${luas.toFixed(2)}m²)` : undefined,
    });
    setAdded(true);
    setTimeout(() => { setAdded(false); onAdded(); }, 1500);
  };

  return (
    <View>
      {isBanner && (
        <View className="mb-5">
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
          <Text className="text-sm text-foreground/50 mt-2">Luas: <Text className="font-bold text-foreground">{luas.toFixed(2)} m²</Text></Text>
        </View>
      )}
      <View className="mb-5">
        <SectionTitle>Pilih Bahan / Tipe</SectionTitle>
        <View className="flex-row flex-wrap">{bahanList.map(b => <OptionChip key={b} label={b} selected={bahan===b} onPress={()=>setBahan(b)} />)}</View>
        {parsedBahanPrice && <Text className="text-xs text-primary mt-1">Rp {parsedBahanPrice.toLocaleString('id-ID')}{isBanner ? '/m²' : '/pcs'}</Text>}
      </View>
      <View className="mb-5">
        <SectionTitle>Finishing</SectionTitle>
        <View className="flex-row flex-wrap">{finishList.map(f => <OptionChip key={f} label={f} selected={finishing===f} onPress={()=>setFinishing(f)} />)}</View>
      </View>
      {!isBanner && (
        <View className="mb-5">
          <SectionTitle>Jumlah (min. {product.minOrder} pcs)</SectionTitle>
          <View className="flex-row items-center gap-x-4">
            <TouchableOpacity onPress={() => setQty(q => Math.max(product.minOrder??1, q-1))} className="w-11 h-11 rounded-full border-2 border-border items-center justify-center">
              <Minus size={18} color="#800000" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold w-14 text-center">{qty}</Text>
            <TouchableOpacity onPress={() => setQty(q => q+1)} className="w-11 h-11 rounded-full border-2 border-border items-center justify-center">
              <Plus size={18} color="#800000" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex-row justify-between mb-4">
        <Text className="text-foreground/60">Total Harga</Text>
        <Text className="font-bold text-primary text-lg">Rp {totalPrice.toLocaleString('id-ID')}</Text>
      </View>
      <AddButton onPress={handleAdd} added={added} />
    </View>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [cartFlash, setCartFlash] = useState(false);

  // Find product from dummy data (fallback)
  const product = DUMMY_PRODUCTS.find(p => p.id === id) ?? null;

  if (!product) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-2xl font-bold text-foreground mb-4">Produk tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-primary px-8 py-4 rounded-full">
          <Text className="text-white font-bold">Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const divisi = (product.divisi ?? '').toUpperCase();
  const imageUrl = product.imageUrl ?? product.images?.[0]?.url ?? `https://placehold.co/800x600/ffe1e8/800000?text=${encodeURIComponent(product.name)}`;

  const handleWAOrder = () => {
    const text = encodeURIComponent(`Halo Admin TOKRAF! 👋\n\nSaya tertarik memesan *${product.name}*.\n\nBisa bantu info harga, estimasi, dan cara pemesanannya? 🙏`);
    Linking.openURL(`https://wa.me/${TOKRAF_WA}?text=${text}`);
  };

  return (
    <View className="flex-1 bg-background">
      <Navbar />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 60, paddingTop: 80 }}>

        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-x-2 px-6 py-4"
        >
          <ArrowLeft size={18} color="#800000" />
          <Text className="text-primary font-bold text-sm">Kembali</Text>
        </TouchableOpacity>

        {/* Product Image */}
        <View className="mx-6 rounded-3xl overflow-hidden bg-secondary mb-6" style={{ aspectRatio: 4/3 }}>
          <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
        </View>

        {/* Header */}
        <Animated.View entering={FadeInUp.duration(400)} className="px-6 mb-6">
          <View className="bg-primary/10 self-start px-3 py-1 rounded-full mb-3">
            <Text className="text-xs font-bold text-primary uppercase tracking-widest">
              {divisi.replace('_', ' ')}
            </Text>
          </View>
          <Text className="text-4xl font-extrabold text-foreground tracking-tighter leading-tight mb-3">
            {product.name}
          </Text>
          <Text className="text-base text-foreground/60 leading-relaxed mb-4">
            {product.description}
          </Text>
          <View className="flex-row items-baseline gap-x-2">
            <Text className="text-xs text-foreground/50 font-bold uppercase tracking-widest">Mulai dari</Text>
            <Text className="text-3xl font-extrabold text-primary">Rp {Number(product.price).toLocaleString('id-ID')}</Text>
          </View>
          {product.minOrder > 1 && (
            <Text className="text-xs text-foreground/50 mt-1">Min. order: {product.minOrder} pcs</Text>
          )}
        </Animated.View>

        {/* Specifications */}
        {product.specifications && (
          <Animated.View entering={FadeInUp.delay(100)} className="px-6 mb-6">
            <View className="bg-secondary rounded-2xl p-5 border border-border">
              <Text className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-3">SPESIFIKASI</Text>
              <Text className="text-sm text-foreground/70 leading-relaxed">{product.specifications}</Text>
            </View>
          </Animated.View>
        )}

        {/* Divider */}
        <View className="px-6 mb-6">
          <Text className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-5">KONFIGURASI PESANAN</Text>

          {divisi === 'KONVEKSI' ? (
            <KonveksiConfig product={product} onAdded={() => setCartFlash(true)} />
          ) : divisi === 'DIGITAL_PRINTING' ? (
            <PrintingConfig product={product} onAdded={() => setCartFlash(true)} />
          ) : (
            <MerchConfig product={product} onAdded={() => setCartFlash(true)} />
          )}
        </View>

        {/* Cart flash */}
        {cartFlash && (
          <Animated.View entering={FadeInUp} className="mx-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex-row items-center gap-x-3 mb-4">
            <CheckCircle color="#22c55e" size={20} />
            <View className="flex-1">
              <Text className="text-green-800 font-bold text-sm">Ditambahkan ke keranjang!</Text>
              <TouchableOpacity onPress={() => router.push('/cart')}>
                <Text className="text-green-600 text-xs mt-0.5">Lihat keranjang →</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Direct WA */}
        <View className="px-6">
          <TouchableOpacity
            onPress={handleWAOrder}
            className="w-full flex-row items-center justify-center gap-x-3 py-5 rounded-full bg-primary"
          >
            <MessageCircle color="#fff" size={22} />
            <Text className="text-white font-bold text-lg tracking-widest">TANYA ADMIN TOKRAF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
