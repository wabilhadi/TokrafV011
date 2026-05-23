import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Animated, { FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ArrowRight, ArrowUpRight } from 'lucide-react-native';
import { TOKRAF_PRODUCTS } from '../lib/products';

const TOKRAF_WA = '6281993294170';

// ─── 6 Produk Terlaris ────────────────────────────────────────────────────────
const BESTSELLERS = [
  { ...TOKRAF_PRODUCTS.find(p => p.id === 'k1')!, badge: 'Terlaris' },
  { ...TOKRAF_PRODUCTS.find(p => p.id === 'm4')!, badge: 'Favorit' },
  { ...TOKRAF_PRODUCTS.find(p => p.id === 'k4')!, badge: 'Hits' },
  { ...TOKRAF_PRODUCTS.find(p => p.id === 'm5')!, badge: 'New' },
  { ...TOKRAF_PRODUCTS.find(p => p.id === 'p1')!, badge: 'Promo' },
  { ...TOKRAF_PRODUCTS.find(p => p.id === 'k2')!, badge: 'Populer' },
];

// ─── Divisions ────────────────────────────────────────────────────────────────
const DIVISIONS = [
  {
    num: '01', key: 'konveksi', href: '/layanan?divisi=konveksi',
    title: 'Tokraf\nKonveksi.',
    desc: 'Kaos, jaket, hoodie, polo, jersey — produksi custom berkualitas tinggi.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
  },
  {
    num: '02', key: 'merch', href: '/layanan?divisi=merch',
    title: 'Tokraf\nMerch.',
    desc: 'Lanyard, mug, tumbler, ganci, ID card — merchandise event profesional.',
    image: 'https://images.unsplash.com/photo-1610943640030-22cba2bd11d3?q=80&w=800',
  },
  {
    num: '03', key: 'printing', href: '/layanan?divisi=digital-printing',
    title: 'Tokraf\nPrint.',
    desc: 'Banner, spanduk, sticker, kartu nama — cetak berkualitas ekspor.',
    image: 'https://images.unsplash.com/photo-1563690623230-0322ba6db7d4?q=80&w=800',
  },
];

// ─── Division Card Component ───────────────────────────────────────────────────
function DivisionCard({ div, index, onPress }: { div: typeof DIVISIONS[0]; index: number; onPress: () => void }) {
  return (
    <Animated.View entering={FadeInUp.delay(100 + index * 100).duration(600)}>
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
        <View className="rounded-[2rem] overflow-hidden mb-4" style={{ height: 280 }}>
          {/* Background */}
          <Image source={{ uri: div.image }} className="absolute inset-0 w-full h-full" resizeMode="cover" style={{ opacity: 0.55 }} />
          <View className="absolute inset-0" style={{ backgroundColor: 'rgba(80,0,0,0.6)' }} />

          {/* Content */}
          <View className="flex-1 p-7 justify-between">
            {/* Top: number */}
            <View className="flex-row items-center gap-x-2">
              <View className="w-1.5 h-1.5 rounded-full bg-white opacity-60" />
              <Text className="text-white text-xs font-bold uppercase tracking-[0.2em] opacity-70">Division {div.num}</Text>
            </View>

            {/* Bottom: title + desc + button */}
            <View>
              <Text className="text-white text-3xl font-extrabold tracking-tighter leading-tight mb-2">{div.title}</Text>
              <Text className="text-white text-sm leading-relaxed mb-5" style={{ opacity: 0.75 }}>{div.desc}</Text>
              <View className="self-start bg-white rounded-full px-5 py-2.5 flex-row items-center gap-x-2">
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
function ProductCard({ product, index, onPress }: { product: typeof BESTSELLERS[0]; index: number; onPress: () => void }) {
  return (
    <Animated.View entering={FadeInUp.delay(index * 80).duration(500)} style={{ width: '48%' }}>
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
        <View className="rounded-[1.5rem] overflow-hidden bg-background border border-border">
          {/* Badge */}
          <View className="absolute top-3 left-3 z-10 bg-primary rounded-full px-3 py-1">
            <Text className="text-white text-[10px] font-bold uppercase tracking-wider">{product.badge}</Text>
          </View>

          {/* Arrow */}
          <View className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full items-center justify-center shadow">
            <ArrowUpRight size={14} color="#0A0A0A" />
          </View>

          {/* Image */}
          <Image
            source={{ uri: product.imageUrl }}
            className="w-full"
            style={{ aspectRatio: 3 / 4 }}
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
            <Text className="text-primary text-lg font-extrabold">
              Rp {Number(product.price).toLocaleString('id-ID')}
            </Text>
            {product.minOrder > 1 && (
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

  return (
    <View className="flex-1 bg-background">
      <Navbar />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* ── HERO ── */}
        <View className="items-center justify-center px-6 pt-40 pb-16">
          <Animated.View entering={FadeInUp.delay(100).duration(900)} className="items-center">
            {/* Pink blob */}
            <View className="absolute w-72 h-72 rounded-full" style={{ backgroundColor: 'rgba(255,182,193,0.25)', top: -40, left: '10%', zIndex: -1, transform: [{ scaleX: 1.5 }] }} />

            <Text className="text-5xl font-extrabold text-foreground text-center leading-tight tracking-tighter mb-4">
              WE BUILD {'\n'}<Text className="text-primary">YOUR IDEA</Text>
            </Text>
            <Text className="text-base font-light text-center text-foreground/70 max-w-xs mb-8 leading-relaxed">
              Layanan konveksi, merchandise & digital printing premium — satu platform.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/layanan')}
              className="bg-primary px-8 py-4 rounded-full flex-row items-center gap-x-2"
              activeOpacity={0.85}
            >
              <Text className="text-white font-bold text-base">Explore Layanan</Text>
              <ArrowRight size={16} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* ── 3 DIVISIONS — stacked cards, mirror web ── */}
        <View className="px-4 mb-8">
          <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
            <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2" style={{ opacity: 0.7 }}>Ekosistem Tokraf</Text>
            <Text className="text-4xl font-extrabold text-foreground tracking-tighter leading-tight">
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

        {/* ── PRODUK TERLARIS ── */}
        <View className="bg-secondary rounded-[2rem] mx-4 mb-4 px-5 pt-8 pb-8">
          {/* Header */}
          <Animated.View entering={FadeInUp.delay(200)} className="flex-row items-end justify-between mb-6">
            <View>
              <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1" style={{ opacity: 0.7 }}>Pilihan Populer</Text>
              <Text className="text-3xl font-extrabold text-foreground tracking-tighter leading-tight">
                Produk{'\n'}<Text className="text-primary">Terlaris.</Text>
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
            {BESTSELLERS.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onPress={() => router.push(`/produk/${product.id}` as any)}
              />
            ))}
          </View>

          {/* Stats */}
          <Animated.View entering={FadeInUp.delay(500)} className="flex-row mt-8 pt-6 border-t border-border">
            {[
              { val: '500+', label: 'Klien' },
              { val: '6 Thn', label: 'Pengalaman' },
              { val: '100%', label: 'Custom' },
            ].map(s => (
              <View key={s.label} className="flex-1 items-center">
                <Text className="text-2xl font-extrabold text-primary">{s.val}</Text>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mt-1">{s.label}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* ── WHY US — dark section ── */}
        <View className="bg-foreground rounded-[2rem] mx-4 mb-4 p-8">
          <Animated.View entering={FadeInUp.delay(200)}>
            <Text className="text-3xl font-extrabold text-background tracking-tighter mb-3">
              The TOKRAF{'\n'}Standard.
            </Text>
            <Text className="text-base text-background/70 font-light leading-relaxed mb-8">
              Bukan sekadar cetak — kami jamin kualitas, kecepatan, dan transparansi di setiap pesanan.
            </Text>
            <View className="gap-y-6 border-t border-background/20 pt-8">
              {[
                { num: '01', title: 'Kualitas Terverifikasi', desc: 'Material premium, QC ketat sebelum sampai ke tanganmu.' },
                { num: '02', title: 'Harga Transparan', desc: 'Tidak ada biaya tersembunyi. Harga jelas dari awal.' },
                { num: '03', title: 'Fast Response', desc: 'Admin siap membantu konsultasi via WhatsApp kapanpun.' },
              ].map(item => (
                <View key={item.num} className="flex-row gap-x-5">
                  <Text className="text-4xl font-light text-primary">{item.num}</Text>
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
            <View className="items-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 28, padding: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', width: '100%' }}>
              <Text className="text-white text-3xl font-extrabold text-center tracking-tighter leading-tight mb-6">
                Mulai Proyek{'\n'}Kamu Hari Ini.
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://wa.me/${TOKRAF_WA}`)}
                className="bg-white rounded-full px-8 py-4"
                activeOpacity={0.85}
              >
                <Text className="text-foreground font-bold text-base">💬 Hubungi Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}
