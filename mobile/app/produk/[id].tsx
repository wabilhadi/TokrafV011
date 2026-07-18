import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, Modal
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking } from 'react-native';
import Navbar from '../../components/Navbar';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Minus, Plus, ShoppingBag, CheckCircle, MessageCircle, Star, X, CheckCircle2 } from 'lucide-react-native';
import { useCartStore } from '../../store/cartStore';
import axios from 'axios';
import { calculateBaseUnitPrice, calculateItemSubtotal } from '../../lib/pricingEngine';

const TOKRAF_WA = '6281993294170';
const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.46:5000';
const API_URL = `${BACKEND_URL}/api`;

// ─── SPEC DICTIONARY ────────────────────────────────────────────────────────────

const SPEC_DICTIONARY: Record<string, {name: string, values: string[]}[]> = {
  'Kaos': [
    { name: 'Bahan', values: ['Cotton Combed 24s', 'Cotton Combed 30s', 'Polyester', 'Drill'] },
    { name: 'Ukuran', values: ['S', 'M', 'L', 'XL', 'XXL', '3XL'] },
    { name: 'Lengan', values: ['Pendek', 'Panjang'] },
    { name: 'Sablon', values: ['Plastisol', 'Rubber', 'DTF', 'Tanpa Sablon'] }
  ],
  'Polo': [
    { name: 'Bahan', values: ['Lacoste CVC', 'Lacoste Pique', 'Polyester'] },
    { name: 'Ukuran', values: ['S', 'M', 'L', 'XL', 'XXL', '3XL'] },
    { name: 'Lengan', values: ['Pendek', 'Panjang'] },
    { name: 'Bordir logo', values: ['1 Titik', '2 Titik', '3 Titik', 'Tanpa Bordir'] }
  ],
  'Kemeja': [
    { name: 'Model', values: ['PDH', 'PDL', 'Korsa'] },
    { name: 'Bahan', values: ['American Drill', 'Nagata Drill', 'Hisofy Drill'] },
    { name: 'Lengan', values: ['Pendek', 'Panjang'] },
    { name: 'Patch / Bordir', values: ['Ya', 'Tidak'] },
    { name: 'Ukuran', values: ['S', 'M', 'L', 'XL', 'XXL', '3XL'] }
  ],
  'Jersey': [
    { name: 'Jenis', values: ['Gaming', 'Futsal', 'Basket', 'Sepeda'] },
    { name: 'Cetak', values: ['Full print', 'DTF'] },
    { name: 'Nama & nomor', values: ['Ya', 'Tidak'] },
    { name: 'Ukuran', values: ['S', 'M', 'L', 'XL', 'XXL'] }
  ],
  'Ganci': [
    { name: 'Bentuk', values: ['Custom', 'Bulat', 'Kotak'] },
    { name: 'Ukuran', values: ['4x4 cm', '5x5 cm', '6x6 cm'] },
    { name: 'Ketebalan', values: ['3 mm', '4 mm', '5 mm'] },
    { name: 'Cetak', values: ['1 Sisi', '2 Sisi'] }
  ],
  'Lanyard': [
    { name: 'Lebar', values: ['1.5 cm', '2 cm', '2.5 cm'] },
    { name: 'Cetak', values: ['1 Sisi', '2 Sisi'] },
    { name: 'Hook', values: ['Standar', 'Premium (Kew-kew tebal)'] },
    { name: 'Safety buckle', values: ['Ya', 'Tidak'] }
  ],
  'Mug': [
    { name: 'Ukuran', values: ['11 oz', '15 oz'] },
    { name: 'Cetak', values: ['1 Sisi', 'Full wrap'] }
  ],
  'Tumbler': [
    { name: 'Kapasitas', values: ['500 ml', '750 ml'] },
    { name: 'Warna', values: ['Hitam', 'Putih', 'Silver', 'Custom'] },
    { name: 'Metode Cetak', values: ['Printing UV', 'Laser Engraving', 'Polos'] }
  ],
  'ID Card': [
    { name: 'Bahan', values: ['PVC', 'Akrilik'] },
    { name: 'Cetak', values: ['1 Sisi', '2 Sisi'] },
    { name: 'Lanyard', values: ['Termasuk', 'Tidak'] }
  ],
  'Pin': [
    { name: 'Ukuran', values: ['44 mm', '58 mm'] },
    { name: 'Belakang', values: ['Peniti', 'Magnet'] }
  ],
  'Stiker': [
    { name: 'Bahan', values: ['Vinyl', 'Transparan', 'Chromo'] },
    { name: 'Potongan', values: ['Die cut', 'Kiss cut'] },
    { name: 'Laminasi', values: ['Glossy', 'Doff', 'Tanpa Laminasi'] },
    { name: 'Ukuran', values: ['A3+', 'Meteran'] }
  ],
  'Banner': [
    { name: 'Ukuran', values: ['Custom', '1x1 m', '2x1 m'] },
    { name: 'Bahan', values: ['Flexi 280g', 'Flexi 340g', 'Flexi Korchin'] },
    { name: 'Finishing', values: ['Mata Ayam', 'Lebihan', 'Lipat Pas'] }
  ],
  'Spanduk': [
    { name: 'Ukuran', values: ['Custom', '3x1 m', '4x1 m'] },
    { name: 'Bahan', values: ['Flexi 280g', 'Flexi 340g'] },
    { name: 'Finishing', values: ['Jahit keliling', 'Tidak dijahit'] }
  ],
  'X Banner': [
    { name: 'Ukuran', values: ['60x160 cm', '80x180 cm'] },
    { name: 'Stand', values: ['Termasuk Stand', 'Tanpa Stand (Cetak Saja)'] }
  ],
  'Poster': [
    { name: 'Ukuran', values: ['A3+', 'A2', 'A1', 'A0'] },
    { name: 'Jenis kertas', values: ['Art Carton 260g', 'Albatros', 'Luster'] },
    { name: 'Laminasi', values: ['Glossy', 'Doff', 'Tanpa Laminasi'] }
  ],
  'Brosur': [
    { name: 'Ukuran', values: ['A4', 'A5'] },
    { name: 'Gramasi', values: ['Art Paper 120g', 'Art Paper 150g'] },
    { name: 'Lipatan', values: ['Tanpa Lipat', 'Lipat 2', 'Lipat 3'] }
  ],
  'Kartu Nama': [
    { name: 'Bahan', values: ['Art Carton 260g', 'Art Carton 310g'] },
    { name: 'Laminasi', values: ['Tanpa Laminasi', 'Glossy', 'Doff'] },
    { name: 'Spot UV', values: ['Tidak', 'Ya'] }
  ],
};

function getEffectiveOptions(product: any) {
  const pName = (product?.name || '').toLowerCase();
  const matchedKey = Object.keys(SPEC_DICTIONARY).find(k => pName.includes(k.toLowerCase()));
  if (matchedKey) return SPEC_DICTIONARY[matchedKey];

  const div = (product?.divisi || '').toUpperCase();
  if (div === 'KONVEKSI') return SPEC_DICTIONARY['Kaos'];
  if (div === 'DIGITAL_PRINTING') return SPEC_DICTIONARY['Banner'];
  return SPEC_DICTIONARY['Lanyard'];
}

// ─── Reusable UI ─────────────────────────────────────────────────────────────

function OptionPill({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full border mr-2 mb-2 ${selected ? 'bg-primary border-primary' : 'bg-background border-border'}`}
      style={selected ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 } : undefined}
    >
      <Text className="text-sm font-semibold" style={selected ? { color: '#fff' } : { color: 'rgba(10, 10, 10, 0.7)' }}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Customer Reviews Component ───────────────────────────────────────────────

function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/reviews/${productId}`);
      setReviews(data);
    } catch (error) {
      console.log('Failed to fetch reviews', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async () => {
    if (!name.trim() || !comment.trim()) {
      Alert.alert('Perhatian', 'Nama dan Komentar harus diisi');
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('comment', comment);
      formData.append('rating', rating.toString());
      // Skip media for mobile to avoid native errors without expo-image-picker
      
      await axios.post(`${API_URL}/reviews/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setName('');
      setComment('');
      setRating(5);
      fetchReviews();
      Alert.alert('Sukses', 'Ulasan berhasil dikirim!');
    } catch (error) {
      console.log('Failed to submit review', error);
      Alert.alert('Error', 'Gagal mengirim ulasan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-8 border-t border-border pt-8">
      <Text className="text-xl font-bold mb-6 text-foreground">Ulasan Pelanggan</Text>
      
      {/* Review List */}
      <View className="mb-8">
        {reviews.length === 0 ? (
          <Text className="text-foreground text-center py-4">Belum ada ulasan untuk produk ini.</Text>
        ) : (
          reviews.map((rev: any) => (
            <View key={rev.id} className="border-b border-border pb-4 mb-4">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="font-bold text-foreground">{rev.name}</Text>
                <Text className="text-xs text-foreground">{new Date(rev.createdAt).toLocaleDateString('id-ID')}</Text>
              </View>
              <View className="flex-row mb-2">
                {[1,2,3,4,5].map((_, i) => (
                  <Star key={i} size={12} color={i < rev.rating ? '#eab308' : '#d1d5db'} fill={i < rev.rating ? '#eab308' : 'transparent'} />
                ))}
              </View>
              <Text className="text-foreground text-sm leading-relaxed mb-2">{rev.comment}</Text>
              {rev.mediaUrl && (
                <Image source={{ uri: `${BACKEND_URL}${rev.mediaUrl}` }} className="w-full h-32 rounded-xl" resizeMode="cover" />
              )}
            </View>
          ))
        )}
      </View>

      {/* Review Form */}
      <View className="bg-secondary rounded-2xl p-5 mb-4">
        <Text className="font-bold text-foreground mb-4">Tulis Ulasan Anda</Text>
        
        <View className="flex-row gap-2 mb-4">
          {[1,2,3,4,5].map(star => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Star size={24} color={star <= rating ? '#eab308' : '#d1d5db'} fill={star <= rating ? '#eab308' : 'transparent'} />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput 
          placeholder="Nama Anda"
          value={name}
          onChangeText={setName}
          className="border border-border rounded-xl px-4 py-3 bg-background text-foreground mb-3"
        />
        <TextInput 
          placeholder="Bagaimana produk kami?"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          className="border border-border rounded-xl px-4 py-3 bg-background text-foreground mb-4 h-24"
        />
        <TouchableOpacity 
          onPress={handleSubmit} 
          disabled={loading}
          className="bg-primary py-3 rounded-xl items-center"
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-white font-bold">Kirim Ulasan</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Universal Configurator (matches website exactly) ───────────────────────

function UniversalConfigurator({ product, onAdd }: { product: any; onAdd: () => void }) {
  // Parse options same as website
  const parsedOptions = (product.options || []).map((opt: any) => {
    let uiType = 'dropdown';
    let choices: any[] = [];
    try {
      if (typeof opt.values === 'string' && opt.values.startsWith('{')) {
        const p = JSON.parse(opt.values);
        uiType = p.uiType || 'dropdown';
        choices = p.choices || [];
      } else if (typeof opt.values === 'string' && opt.values.startsWith('[')) {
        choices = JSON.parse(opt.values);
        if (opt.name.toLowerCase().includes('ukuran') || opt.name.toLowerCase().includes('size')) uiType = 'stepper';
      } else if (typeof opt.values === 'string') {
        choices = opt.values.split(',').filter((v: string) => v.trim()).map((v: string) => ({ label: v.trim(), priceMod: 0 }));
      } else if (Array.isArray(opt.values)) {
        choices = opt.values;
        if (opt.name.toLowerCase().includes('ukuran') || opt.name.toLowerCase().includes('size')) uiType = 'stepper';
      }
    } catch { choices = []; }
    return { ...opt, uiType, choices };
  });

  const bulkOption = parsedOptions.find((o: any) => o.uiType === 'stepper');
  const globalOptions = parsedOptions.filter((o: any) => o !== bulkOption);

  const [selections, setSelections] = useState<Record<string, { label: string; priceMod: number; metadata?: string }>>({});
  const [bulkQty, setBulkQty] = useState<Record<string, number>>({});
  const [qty, setQty] = useState(product.minOrder ?? 1);
  const [note, setNote] = useState('');
  const [added, setAdded] = useState(false);
  const [showWAForm, setShowWAForm] = useState(false);
  const [waName, setWaName] = useState('');
  const [waInstansi, setWaInstansi] = useState('');
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    const initial: Record<string, any> = {};
    globalOptions.forEach((opt: any) => { if (opt.choices.length > 0) initial[opt.name] = opt.choices[0]; });
    setSelections(initial);
  }, [product.id]);

  const basePrice = Number(product.price || 0);
  const globalMods = Object.values(selections).map((v: any) => v?.priceMod || 0);
  const effectiveBasePrice = calculateBaseUnitPrice(basePrice, globalMods);

  let totalQty = 0;
  if (bulkOption) { bulkOption.choices.forEach((v: any) => { totalQty += (bulkQty[v.label] || 0); }); }
  else { totalQty = qty; }

  const pricing = calculateItemSubtotal(effectiveBasePrice, totalQty);

  let grandTotal = 0;
  if (bulkOption) {
    bulkOption.choices.forEach((v: any) => {
      const q = bulkQty[v.label] || 0;
      if (q > 0) {
        const p = calculateItemSubtotal(effectiveBasePrice + (v.priceMod || 0), totalQty);
        grandTotal += p.finalUnitPrice * q;
      }
    });
  } else { grandTotal = pricing.grandTotal; }

  const handleAdd = () => {
    if (totalQty < (product.minOrder ?? 1)) return;
    const globalOptsRecord = Object.fromEntries(Object.entries(selections).map(([k, v]: any) => [k, v.label]));
    if (bulkOption) {
      bulkOption.choices.forEach((v: any) => {
        const q = bulkQty[v.label] || 0;
        if (q > 0) addItem({ productId: product.id, name: product.name, price: effectiveBasePrice + (v.priceMod || 0), quantity: q, imageUrl: product.images?.[0]?.url || product.imageUrl, customOptions: { ...globalOptsRecord, [bulkOption.name]: v.label }, customNote: note || undefined });
      });
    } else {
      addItem({ productId: product.id, name: product.name, price: effectiveBasePrice, quantity: totalQty, imageUrl: product.images?.[0]?.url || product.imageUrl, customOptions: globalOptsRecord, customNote: note || undefined });
    }
    setAdded(true); setTimeout(() => setAdded(false), 2000); onAdd();
  };

  const handleSendWA = () => {
    if (!waName.trim()) { Alert.alert('Perhatian', 'Nama wajib diisi!'); return; }
    const specs = Object.entries(selections).map(([k, v]: any) => `🔧 ${k}: ${v.label}`).join('\n');
    const msg = `Halo Admin TOKRAF! 📦\n\n📋 DETAIL PESANAN:\n${product.name}\n${totalQty} pcs × Rp ${effectiveBasePrice.toLocaleString('id-ID')}\n${specs}${note ? `\n📝 Catatan: ${note}` : ''}\n\n💰 TOTAL: Rp ${grandTotal.toLocaleString('id-ID')}\n\n👤 ${waName}${waInstansi ? ` - ${waInstansi}` : ''}\n\nMohon info ketersediaan & estimasi. Terima kasih! 🙏`;
    Linking.openURL(`https://wa.me/${TOKRAF_WA}?text=${encodeURIComponent(msg)}`);
    setShowWAForm(false);
  };

  const S = { label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1, color: 'rgba(128,0,0,0.6)', textTransform: 'uppercase' as const, marginBottom: 10 } };

  return (
    <View>
      {/* Global Options */}
      {globalOptions.map((opt: any) => (
        <View key={opt.name} style={{ marginBottom: 20 }}>
          <Text style={S.label}>{opt.name}</Text>

          {opt.uiType === 'swatch' && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {opt.choices.map((v: any) => (
                <TouchableOpacity key={v.label} onPress={() => setSelections(p => ({ ...p, [opt.name]: v }))}
                  style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: v.metadata || '#000', borderWidth: selections[opt.name]?.label === v.label ? 3 : 1.5, borderColor: selections[opt.name]?.label === v.label ? '#800000' : 'rgba(0,0,0,0.15)', transform: [{ scale: selections[opt.name]?.label === v.label ? 1.12 : 1 }] }} />
              ))}
            </View>
          )}

          {opt.uiType === 'radio' && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {opt.choices.map((v: any) => {
                const sel = selections[opt.name]?.label === v.label;
                return (
                  <TouchableOpacity key={v.label} onPress={() => setSelections(p => ({ ...p, [opt.name]: v }))}
                    style={{ padding: 14, borderRadius: 12, borderWidth: 2, borderColor: sel ? '#800000' : 'rgba(0,0,0,0.12)', backgroundColor: sel ? 'rgba(128,0,0,0.05)' : '#fff', minWidth: '47%' }}>
                    <Text style={{ fontWeight: '700', color: sel ? '#800000' : '#0A0A0A' }}>{v.label}</Text>
                    {v.priceMod > 0 && <Text style={{ fontSize: 12, color: '#800000' }}>+Rp{v.priceMod.toLocaleString('id-ID')}</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {opt.uiType === 'dropdown' && (
            <View style={{ borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 12, backgroundColor: '#fff', overflow: 'hidden' }}>
              {opt.choices.map((v: any, i: number) => {
                const sel = selections[opt.name]?.label === v.label;
                return (
                  <TouchableOpacity key={v.label} onPress={() => setSelections(p => ({ ...p, [opt.name]: v }))}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, backgroundColor: sel ? 'rgba(128,0,0,0.06)' : '#fff', borderTopWidth: i > 0 ? 1 : 0, borderTopColor: 'rgba(0,0,0,0.07)' }}>
                    <Text style={{ fontWeight: sel ? '700' : '500', color: sel ? '#800000' : '#0A0A0A' }}>{v.label}{v.priceMod > 0 ? ` (+Rp${v.priceMod.toLocaleString('id-ID')})` : ''}</Text>
                    {sel && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#800000' }} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {opt.uiType !== 'swatch' && opt.uiType !== 'radio' && opt.uiType !== 'dropdown' && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {opt.choices.map((v: any) => {
                const sel = selections[opt.name]?.label === v.label;
                return (
                  <TouchableOpacity key={v.label} onPress={() => setSelections(p => ({ ...p, [opt.name]: v }))}
                    style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50, borderWidth: 1.5, borderColor: sel ? '#800000' : 'rgba(0,0,0,0.15)', backgroundColor: sel ? '#800000' : '#fff' }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: sel ? '#fff' : 'rgba(10,10,10,0.7)' }}>{v.label}{v.priceMod > 0 ? ` (+Rp${v.priceMod.toLocaleString('id-ID')})` : ''}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      ))}

      {/* Bulk qty table or simple stepper */}
      {bulkOption ? (
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={S.label}>Kuantitas per {bulkOption.name}</Text>
            <View style={{ backgroundColor: '#F5F5F5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#0A0A0A' }}>Total: {totalQty} pcs</Text>
            </View>
          </View>
          <View style={{ borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 16, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', backgroundColor: '#F8F8F8', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.07)' }}>
              <Text style={{ flex: 1, fontWeight: '700', fontSize: 12, color: '#0A0A0A' }}>{bulkOption.name}</Text>
              <Text style={{ fontWeight: '700', fontSize: 12, color: '#0A0A0A' }}>Jumlah</Text>
            </View>
            {bulkOption.choices.map((v: any, i: number) => {
              const q = bulkQty[v.label] || 0;
              return (
                <View key={v.label} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: 'rgba(0,0,0,0.06)' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: '#0A0A0A' }}>{v.label}</Text>
                    {v.priceMod > 0 && <Text style={{ fontSize: 11, color: '#800000' }}>+Rp{v.priceMod.toLocaleString('id-ID')}</Text>}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <TouchableOpacity onPress={() => setBulkQty(p => ({ ...p, [v.label]: Math.max(0, q - 1) }))} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' }}>
                      <Minus size={13} color="#0A0A0A" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: '700', minWidth: 24, textAlign: 'center' }}>{q}</Text>
                    <TouchableOpacity onPress={() => setBulkQty(p => ({ ...p, [v.label]: q + 1 }))} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={13} color="#0A0A0A" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={{ marginBottom: 20 }}>
          <Text style={S.label}>Kuantitas (pcs)</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity onPress={() => setQty((q: number) => Math.max(product.minOrder ?? 1, q - 1))} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' }}>
              <Minus size={18} color="#0A0A0A" />
            </TouchableOpacity>
            <Text style={{ fontSize: 30, fontWeight: '800', minWidth: 48, textAlign: 'center', color: '#0A0A0A' }}>{qty}</Text>
            <TouchableOpacity onPress={() => setQty((q: number) => q + 1)} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={18} color="#0A0A0A" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Note */}
      <View style={{ marginBottom: 20 }}>
        <Text style={S.label}>Catatan Khusus (Opsional)</Text>
        <TextInput multiline numberOfLines={3} value={note} onChangeText={setNote}
          placeholder="Misal: logo di dada kiri, sablon DTF belakang full..."
          placeholderTextColor="#bbb" textAlignVertical="top"
          style={{ borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 16, padding: 14, fontSize: 14, color: '#0A0A0A', backgroundColor: '#fff', minHeight: 80 }} />
      </View>

      {/* Order Summary Panel */}
      <View style={{ borderWidth: 2, borderColor: 'rgba(128,0,0,0.2)', borderRadius: 24, padding: 20, backgroundColor: '#fff', marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0A0A0A', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.07)' }}>Ringkasan Pesanan</Text>
        <View style={{ gap: 10, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={{ color: 'rgba(10,10,10,0.6)', fontSize: 13, flex: 1, paddingRight: 8 }}>Harga Dasar</Text>
            <Text style={{ fontWeight: '600', fontSize: 13, flexShrink: 0 }}>Rp {basePrice.toLocaleString('id-ID')}</Text>
          </View>
          {Object.entries(selections).map(([k, v]: any) => v.priceMod > 0 && (
            <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={{ color: 'rgba(10,10,10,0.6)', fontSize: 13, flex: 1, paddingRight: 8 }}>{k} ({v.label})</Text>
              <Text style={{ color: '#800000', fontWeight: '600', fontSize: 13, flexShrink: 0 }}>+Rp {v.priceMod.toLocaleString('id-ID')}</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={{ color: 'rgba(10,10,10,0.6)', fontSize: 13, flex: 1, paddingRight: 8 }}>Kuantitas</Text>
            <Text style={{ fontWeight: '600', fontSize: 13, flexShrink: 0 }}>{totalQty} pcs</Text>
          </View>
          {pricing.discountPercentage > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f0fdf4', padding: 10, borderRadius: 10 }}>
              <Text style={{ color: '#16a34a', fontWeight: '700', fontSize: 13 }}>Diskon Grosir ({pricing.discountPercentage}%)</Text>
              <Text style={{ color: '#16a34a', fontWeight: '700', fontSize: 13 }}>- Rp {(grandTotal * pricing.discountPercentage / 100).toLocaleString('id-ID')}</Text>
            </View>
          )}
        </View>
        <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.07)', paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>Total Harga</Text>
          <Text style={{ fontSize: 32, fontWeight: '800', color: '#800000', lineHeight: 36 }}>Rp {grandTotal.toLocaleString('id-ID')}</Text>
        </View>
      </View>

      {totalQty > 0 && totalQty < (product.minOrder ?? 1) && (
        <Text style={{ color: '#dc2626', fontWeight: '700', fontSize: 13, textAlign: 'center', marginBottom: 10 }}>Minimum order {product.minOrder ?? 1} pcs</Text>
      )}

      {/* CTA Buttons */}
      <TouchableOpacity onPress={handleAdd} disabled={totalQty < (product.minOrder ?? 1)}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 14, marginBottom: 10, backgroundColor: added ? '#16a34a' : (totalQty < (product.minOrder ?? 1) ? '#F0F0F0' : '#0A0A0A') }}>
        {added ? <CheckCircle size={22} color="#fff" /> : <ShoppingBag size={22} color={totalQty < (product.minOrder ?? 1) ? '#aaa' : '#fff'} />}
        <Text style={{ fontWeight: '800', fontSize: 16, color: totalQty < (product.minOrder ?? 1) ? '#aaa' : '#fff' }}>{added ? 'Tersimpan!' : 'Tambah ke Keranjang'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowWAForm(true)}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 14, backgroundColor: '#800000' }}>
        <MessageCircle size={22} color="#fff" />
        <Text style={{ fontWeight: '800', fontSize: 16, color: '#fff' }}>Pesan Langsung via WA</Text>
      </TouchableOpacity>

      {/* Trust badges */}
      <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.07)', gap: 8 }}>
        {['Konsultasi gratis', 'Respon admin ±5 menit', 'Bisa revisi desain sebelum produksi'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} color="#22c55e" /><Text style={{ fontSize: 13, color: 'rgba(10,10,10,0.7)' }}>{t}</Text>
          </View>
        ))}
      </View>

      {/* WA Modal */}
      <Modal visible={showWAForm} transparent animationType="slide" onRequestClose={() => setShowWAForm(false)}>
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} 
          activeOpacity={1} 
          onPress={() => setShowWAForm(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={{ backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingTop: 40 }}
            onPress={(e) => e.stopPropagation()} // Prevent closing when tapping inside the form
          >
            <TouchableOpacity 
              onPress={() => setShowWAForm(false)} 
              style={{ position: 'absolute', top: 20, right: 20, width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center', zIndex: 50, elevation: 5 }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <X size={16} color="#0A0A0A" />
            </TouchableOpacity>
            
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#0A0A0A', marginBottom: 6 }}>Pesan via WhatsApp</Text>
            <Text style={{ fontSize: 14, color: 'rgba(10,10,10,0.5)', marginBottom: 20 }}>Lengkapi data agar admin bisa merespon lebih cepat.</Text>
            
            <Text style={{ fontSize: 13, fontWeight: '700', marginBottom: 6 }}>Nama Lengkap *</Text>
            <TextInput value={waName} onChangeText={setWaName} placeholder="Nama Anda" placeholderTextColor="#bbb"
              style={{ borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.12)', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 14 }} />
            
            <Text style={{ fontSize: 13, fontWeight: '700', marginBottom: 6 }}>Instansi / Organisasi <Text style={{ fontWeight: '400', color: '#999' }}>(opsional)</Text></Text>
            <TextInput value={waInstansi} onChangeText={setWaInstansi} placeholder="Nama komunitas/perusahaan" placeholderTextColor="#bbb"
              style={{ borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.12)', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 24 }} />
            
            <TouchableOpacity onPress={handleSendWA} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#25D366', paddingVertical: 16, borderRadius: 14 }}>
              <MessageCircle size={22} color="#fff" />
              <Text style={{ fontWeight: '800', fontSize: 16, color: '#fff' }}>Lanjutkan ke WhatsApp</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}



// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#800000" />
      </View>
    );
  }

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
  
  const images: string[] = [];
  if (product.images?.length > 0) {
    images.push(...product.images.map((i: any) => i.url.startsWith('http') ? i.url : `${BACKEND_URL}${i.url}`));
  } else if (product.imageUrl) {
    images.push(product.imageUrl.startsWith('http') ? product.imageUrl : `${BACKEND_URL}${product.imageUrl}`);
  } else {
    images.push(`https://placehold.co/800x600/ffe1e8/800000?text=${encodeURIComponent(product.name)}`);
  }

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
        <View className="mx-6 rounded-3xl overflow-hidden bg-secondary mb-4" style={{ aspectRatio: 4/3 }}>
          <Image source={{ uri: images[activeImg] }} className="w-full h-full" resizeMode="cover" />
        </View>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 mb-6">
            <View className="flex-row gap-x-3 pr-12">
              {images.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setActiveImg(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${activeImg === idx ? 'border-primary' : 'border-transparent'}`}
                  style={activeImg !== idx ? { opacity: 0.6 } : undefined}
                >
                  <Image source={{ uri: img }} className="w-full h-full object-cover" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Header */}
        <Animated.View entering={FadeInUp.duration(400)} className="px-6 mb-4">
          <View className="self-start px-3 py-1 rounded-full mb-3" style={{ backgroundColor: 'rgba(128, 0, 0, 0.1)' }}>
            <Text className="text-xs font-bold text-primary uppercase tracking-widest">
              {divisi.replace('_', ' ')}
            </Text>
          </View>
          <Text className="text-3xl font-extrabold text-foreground tracking-tighter leading-tight mb-3">
            {product.name}
          </Text>
          <Text className="text-base leading-relaxed mb-4" style={{ color: 'rgba(10, 10, 10, 0.6)' }}>
            {product.description}
          </Text>
          <View className="rounded-2xl p-4 flex-row justify-between items-center mb-2" style={{ backgroundColor: 'rgba(128, 0, 0, 0.05)', borderColor: 'rgba(128, 0, 0, 0.2)', borderWidth: 1 }}>
            <Text className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(10, 10, 10, 0.5)' }}>Mulai dari</Text>
            <Text className="text-xl font-extrabold text-primary">Rp {Number(product.price).toLocaleString('id-ID')}</Text>
          </View>
        </Animated.View>

        {/* Universal Configurator */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold font-heading text-foreground uppercase tracking-widest mb-4">
            Konfigurasi Pesanan
          </Text>
          <UniversalConfigurator product={product} onAdd={() => {}} />
        </View>

        {/* Reviews */}
        <View className="px-6">
          <ProductReviews productId={product.id} />
        </View>

      </ScrollView>
    </View>
  );
}
