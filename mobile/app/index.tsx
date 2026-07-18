import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, Pressable, TextInput, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useRouter } from 'expo-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Animated, { FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ArrowRight, ArrowUpRight, Search, Star } from 'lucide-react-native';
import { TOKRAF_PRODUCTS } from '../lib/products';

const TOKRAF_WA = '6281993294170';

// Bestsellers fetched dynamically

// ─── Divisions ────────────────────────────────────────────────────────────────
const DIVISIONS = [
  {
    key: 'konveksi', href: '/layanan?divisi=konveksi',
    title: 'Tokraf\nKonveksi.',
    desc: 'Kaos, jaket, hoodie, polo, jersey — produksi custom berkualitas tinggi.',
    // Clothing/textile manufacturing photo
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800',
  },
  {
    key: 'merch', href: '/layanan?divisi=merch',
    title: 'Tokraf\nMerch.',
    desc: 'Lanyard, mug, tumbler, ganci, ID card — merchandise event profesional.',
    // Merchandise / branded products photo
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800',
  },
  {
    key: 'printing', href: '/layanan?divisi=digital-printing',
    title: 'Tokraf\nPrint.',
    desc: 'Banner, spanduk, sticker, kartu nama — cetak berkualitas ekspor.',
    // Digital printing / large format photo
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800',
  },
];

// ─── Division Card Component ───────────────────────────────────────────────────
function DivisionCard({ div, index, onPress }: { div: typeof DIVISIONS[0]; index: number; onPress: () => void }) {
  return (
    <Animated.View entering={FadeInUp.delay(100 + index * 100).duration(600)}>
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
        <View className="rounded-[2rem] overflow-hidden mb-4" style={{ height: 240 }}>
          {/* Background image */}
          <Image source={{ uri: div.image }} className="absolute inset-0 w-full h-full" resizeMode="cover" style={{ opacity: 0.6 }} />
          <View className="absolute inset-0" style={{ backgroundColor: 'rgba(60,0,0,0.55)' }} />

          {/* Content — full height flex, space-between */}
          <View className="flex-1 justify-between" style={{ padding: 24 }}>
            {/* Title area — top */}
            <Text className="text-white text-3xl font-extrabold tracking-tighter leading-tight">{div.title}</Text>

            {/* Desc + Button — bottom */}
            <View>
              <Text className="text-white text-sm leading-relaxed mb-5" style={{ opacity: 0.8 }}>{div.desc}</Text>
              <View className="self-start bg-white rounded-full flex-row items-center gap-x-2" style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <Text className="text-foreground font-bold text-sm">Explore</Text>
                <ArrowRight size={14} color="#0A0A0A" />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Product Card Component ────────────────────────────────────────────────────
function ProductCard({ product, index, onPress }: { product: any; index: number; onPress: () => void }) {
  return (
    <Animated.View entering={FadeInUp.delay(index * 80).duration(500)} style={{ width: '48%' }}>
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
        <View className="rounded-[1.5rem] overflow-hidden bg-background border border-border">
          {/* Badge */}
          <View className="absolute top-3 left-3 z-10 bg-primary rounded-full px-3 py-1">
            <Text className="text-white text-[10px] font-bold uppercase tracking-wider">Terbaru</Text>
          </View>

          {/* Arrow */}
          <View className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full items-center justify-center shadow">
            <ArrowUpRight size={14} color="#0A0A0A" />
          </View>

          <Image
            source={{ uri: product.imageUrl?.startsWith('http') ? product.imageUrl : `${process.env.EXPO_PUBLIC_API_URL}${product.imageUrl}` }}
            className="w-full"
            style={{ aspectRatio: 1 }}
            resizeMode="cover"
          />

          {/* Info */}
          <View className="p-4">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1" style={{ opacity: 0.7 }}>
              {product.divisi.replace('_', ' ')}
            </Text>
            <Text className="text-foreground font-bold text-sm leading-tight mb-3" numberOfLines={2}>
              {product.name}
            </Text>
            <Text className="text-[10px] text-foreground/40 mb-0.5">Mulai dari</Text>
            <Text className="text-primary text-xl font-extrabold">
              Rp {Number(product.price).toLocaleString('id-ID')}
            </Text>
            {product.minOrder && product.minOrder > 1 && (
              <Text className="text-[10px] text-foreground/40 mt-1">Min. {product.minOrder} pcs</Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBarHidden, setSearchBarHidden] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Search bar sits at ~128px from top. Once scrolled past it, show navbar search icon.
  const SEARCH_BAR_THRESHOLD = 120;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    setSearchBarHidden(y > SEARCH_BAR_THRESHOLD);
  };

  const focusSearch = () => {
    // First scroll to top smoothly, then focus the search input
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setTimeout(() => searchInputRef.current?.focus(), 350);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/layanan',
        params: { search: searchQuery }
      });
      setSearchQuery('');
    }
  };

  React.useEffect(() => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://tokraf-backend.vercel.app';
    fetch(`${apiUrl}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBestsellers(data.slice(0, 6));
          setRecommended(data.filter((p: any) => p.isRecommended).slice(0, 4));
        }
      })
      .catch(() => {
        setBestsellers([]);
        setRecommended([]);
      });
  }, []);

  return (
    <View className="flex-1 bg-background">
      <Navbar searchBarHidden={searchBarHidden} onSearchPress={focusSearch} />

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >

        {/* ── SEARCH BAR ── */}
        <Animated.View entering={FadeInUp.duration(600)} className="px-6 pt-32 pb-4">
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', borderRadius: 50, paddingHorizontal: 20, paddingVertical: 14 }}>
            <Search color="#999" size={20} />
            <TextInput
              ref={searchInputRef}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              placeholder="Cari kebutuhan konveksi atau cetak..."
              placeholderTextColor="#999"
              style={{ flex: 1, marginLeft: 12, fontSize: 15, color: '#0A0A0A', fontWeight: '500' }}
              returnKeyType="search"
            />
          </View>
        </Animated.View>

        {/* ── HERO ── */}
        <View className="items-center justify-center px-6 pt-6 pb-16">
          <Animated.View entering={FadeInUp.delay(100).duration(900)} className="items-center w-full">
            <Text className="text-4xl font-extrabold text-foreground text-center leading-tight tracking-tighter mb-4">
              Kualitas {'\n'}<Text className="text-primary">Tanpa Kompromi.</Text>
            </Text>
            <Text className="text-base font-light text-center text-foreground/70 max-w-xs mb-8 leading-relaxed">
              Mitra produksi terpercaya Anda untuk konveksi premium, merchandise eksklusif, dan digital printing beresolusi tinggi.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/layanan')}
              className="bg-primary px-8 py-4 rounded-full flex-row items-center gap-x-2"
              activeOpacity={0.85}
            >
              <Text className="text-white font-bold text-base">Lihat Layanan Kami</Text>
              <ArrowRight size={16} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* ── 3 DIVISIONS — stacked cards, mirror web ── */}
        <View className="px-4 mb-8">
          <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
            <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2" style={{ opacity: 0.7 }}>Ekosistem Tokraf</Text>
            <Text className="text-3xl font-extrabold text-foreground tracking-tighter leading-tight">
              3 Divisi.{'\n'}<Text className="text-primary" style={{ opacity: 0.4 }}>Satu Atap.</Text>
            </Text>
          </Animated.View>

          {DIVISIONS.map((div, i) => (
            <DivisionCard
              key={div.key}
              div={div}
              index={i}
              onPress={() => router.push(div.href as any)}
            />
          ))}
        </View>

        {/* ── REKOMENDASI PRODUK ── */}
        {recommended.length > 0 && (
          <View className="bg-card border border-border/50 rounded-[2rem] mx-4 mb-4 px-5 pt-8 pb-8">
            <Animated.View entering={FadeInUp.delay(200)} className="flex-row items-end justify-between mb-6">
              <View>
                <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1" style={{ opacity: 0.7 }}>Pilihan Admin</Text>
                <Text className="text-3xl font-extrabold text-foreground tracking-tighter leading-tight">
                  Rekomendasi{'\n'}<Text className="text-primary">Produk.</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/layanan')}
                className="bg-secondary px-5 py-3 rounded-full flex-row items-center gap-x-1"
                activeOpacity={0.85}
              >
                <Text className="text-foreground font-bold text-xs">Semua</Text>
                <ArrowRight size={12} color="#000" />
              </TouchableOpacity>
            </Animated.View>

            {/* 2-column grid */}
            <View className="flex-row flex-wrap gap-y-4" style={{ justifyContent: 'space-between' }}>
              {recommended.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  onPress={() => router.push(`/produk/${product.id}` as any)}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── PRODUK TERLARIS ── */}
        <View className="bg-secondary rounded-[2rem] mx-4 mb-4 px-5 pt-8 pb-8">
          {/* Header */}
          <Animated.View entering={FadeInUp.delay(200)} className="flex-row items-end justify-between mb-6">
            <View>
              <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1" style={{ opacity: 0.7 }}>Pilihan Populer & Terlaris</Text>
              <Text className="text-3xl font-extrabold text-foreground tracking-tighter leading-tight">
                Kebutuhan esensial{'\n'}<Text className="text-primary">brand Anda.</Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/layanan')}
              className="bg-primary px-5 py-3 rounded-full flex-row items-center gap-x-1"
              activeOpacity={0.85}
            >
              <Text className="text-white font-bold text-xs">Semua</Text>
              <ArrowRight size={12} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          {/* 2-column grid */}
          <View className="flex-row flex-wrap gap-y-4" style={{ justifyContent: 'space-between' }}>
            {bestsellers.length === 0 ? (
              <Text style={{ textAlign: 'center', width: '100%', paddingVertical: 20, color: 'gray' }}>Belum ada produk</Text>
            ) : (
              bestsellers.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  onPress={() => router.push(`/produk/${product.id}` as any)}
                />
              ))
            )}
          </View>

          {/* Stats */}
          <Animated.View entering={FadeInUp.delay(500)} className="flex-row mt-8 pt-6 border-t border-border">
            {[
              { val: '100+', label: 'Klien Puas' },
              { val: '1 Thn', label: 'Pengalaman' },
              { val: '100%', label: 'Custom Made' },
            ].map(s => (
              <View key={s.label} className="flex-1 items-center">
                <Text className="text-2xl font-extrabold text-primary">{s.val}</Text>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mt-1">{s.label}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* ── CLIENT LOGOS ── */}
        <Animated.View entering={FadeInUp.delay(200)} className="py-12 border-y border-border/50 bg-secondary/30 mb-4">
          <View className="px-6 text-center mb-8">
            <Text className="text-sm font-bold uppercase tracking-widest text-foreground/50 text-center">Dipercaya oleh 100+ Klien & Organisasi</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
            <View className="flex-row gap-x-8 items-center pr-12 opacity-60">
              {['UNU JOGJA', 'PGSD UNU Jogja', 'UIN SUKA', 'FTI UNU Jogja', 'FE UNU Jogja', 'FLORANCE UNU Jogja', 'PERMASUM UNU Jogja', 'Wo-Men In Tech Security', '++++'].map((client, idx) => (
                <Text key={idx} className="text-2xl font-bold tracking-tighter text-foreground">{client}</Text>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* ── TESTIMONI ── */}
        <Animated.View entering={FadeInUp.delay(200)} className="py-10 px-4 bg-secondary/30 mb-8 rounded-[2rem] mx-4">
          <View className="items-center mb-8">
            <Text className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">Ulasan Klien</Text>
            <Text className="text-3xl font-extrabold text-foreground tracking-tighter mt-2 text-center">
              Kata <Text className="text-primary">Mereka.</Text>
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
            <View className="flex-row gap-x-4 pr-8">
              {[
                { name: 'Budi (Panitia Event)', review: 'Bikin kaos panitia di sini cepet banget dan hasilnya memuaskan. Sablonnya awet gak gampang pecah.' },
                { name: 'Siti (HIMA Kampus)', review: 'Pesen lanyard sama ID card buat maba. Kualitasnya juara, adminnya juga fast respon dan ramah.' },
                { name: 'Agus (Pemilik UMKM)', review: 'Cetak banner dan stiker kemasan selalu di Tokraf. Warnanya tajam dan harganya bersahabat buat UMKM.' },
              ].map((t, i) => (
                <View key={i} className="bg-card border border-border p-6 rounded-3xl w-72">
                  <View className="flex-row mb-3 gap-x-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} color="#eab308" fill="#eab308" />)}
                  </View>
                  <Text className="text-foreground/80 leading-relaxed mb-4">{t.review}</Text>
                  <Text className="font-bold text-foreground">{t.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* ── WHY US — dark section ── */}
        <View className="bg-foreground rounded-[2rem] mx-4 mb-4 p-8">
          <Animated.View entering={FadeInUp.delay(200)}>
            <Text className="text-2xl font-extrabold text-background tracking-tighter mb-3">
              Standar{'\n'}Kami.
            </Text>
            <Text className="text-base text-background/70 font-light leading-relaxed mb-8">
              Kami tidak sekadar memproduksi. Kami memastikan setiap detail dari pesanan Anda memenuhi standar kualitas industri.
            </Text>
            <View className="gap-y-6 border-t border-background/20 pt-8">
              {[
                { num: '01', title: 'Material Premium', desc: 'Setiap bahan kain dan tinta cetak yang kami gunakan dipilih secara spesifik untuk menjamin keawetan dan kenyamanan.' },
                { num: '02', title: 'Harga Terjangkau', desc: 'Kualitas terbaik yang dirancang khusus agar harganya tetap masuk akal untuk mahasiswa dan organisasi.' },
                { num: '03', title: 'Tepat Waktu', desc: 'Kami sangat menghargai timeline Anda. Pesanan akan selalu diproses dan diselesaikan sesuai jadwal yang disepakati.' },
              ].map(item => (
                <View key={item.num} className="flex-row gap-x-5">
                  <Text className="text-3xl font-light text-primary">{item.num}</Text>
                  <View className="flex-1">
                    <Text className="text-background font-bold text-base mb-1">{item.title}</Text>
                    <Text className="text-background/60 text-sm leading-relaxed">{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* ── CTA ── */}
        <View className="mx-4 mb-4 rounded-[2rem] overflow-hidden" style={{ minHeight: 280 }}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200' }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
            style={{ opacity: 0.7 }}
          />
          <View className="absolute inset-0" style={{ backgroundColor: 'rgba(80,0,0,0.5)' }} />

          <View className="flex-1 p-8 items-center justify-center" style={{ minHeight: 280 }}>
            <View className="items-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 28, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', width: '100%' }}>
              <Text className="text-white text-2xl font-extrabold text-center tracking-tighter leading-tight mb-6">
                Siap mewujudkan{'\n'}merchandise impian Anda?
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://wa.me/${TOKRAF_WA}`)}
                className="bg-white rounded-full px-6 py-4 flex-row items-center gap-x-2"
                activeOpacity={0.85}
              >
                <Text className="text-foreground font-bold text-sm">💬 Konsultasi Gratis Sekarang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}
