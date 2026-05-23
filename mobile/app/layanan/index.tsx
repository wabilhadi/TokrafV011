import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowUpRight } from 'lucide-react-native';
import { TOKRAF_PRODUCTS } from '../../lib/products';

const TABS = [
  { id: 'all',              label: 'Semua' },
  { id: 'konveksi',         label: 'Konveksi' },
  { id: 'merch',            label: 'Merch' },
  { id: 'digital-printing', label: 'Printing' },
];

// Map URL slug → divisi value di products.ts
const SLUG_TO_CATEGORY: Record<string, string> = {
  'konveksi':         'konveksi',
  'merch':            'merch',
  'digital-printing': 'digital-printing',
};

export default function Layanan() {
  const router = useRouter();
  // Support /layanan?divisi=konveksi (from division cards) dan /layanan/index
  const params = useLocalSearchParams<{ divisi?: string; category?: string }>();
  const initialTab = params.divisi ?? params.category ?? 'all';

  const [activeTab, setActiveTab] = useState(
    SLUG_TO_CATEGORY[initialTab] ?? 'all'
  );

  const filtered = activeTab === 'all'
    ? TOKRAF_PRODUCTS
    : TOKRAF_PRODUCTS.filter(p => p.category === activeTab);

  const title = activeTab === 'all' ? 'All Services.' : TABS.find(t => t.id === activeTab)?.label + '.';

  return (
    <View className="flex-1 bg-background">
      <Navbar />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 60, paddingTop: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 mb-8">
          <Animated.Text
            entering={FadeInUp.duration(500)}
            className="text-5xl font-extrabold tracking-tighter text-foreground mb-6"
          >
            {title}
          </Animated.Text>

          {/* Filter tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
            <View className="flex-row gap-x-2 px-1">
              {TABS.map(tab => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full border ${
                    activeTab === tab.id
                      ? 'bg-foreground border-foreground'
                      : 'bg-transparent border-foreground/20'
                  }`}
                  activeOpacity={0.8}
                >
                  <Text className={`font-bold text-sm ${
                    activeTab === tab.id ? 'text-background' : 'text-foreground/60'
                  }`}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Products grid — 2 columns */}
        <View className="px-4 flex-row flex-wrap" style={{ justifyContent: 'space-between' }}>
          {filtered.map((product, idx) => (
            <Animated.View
              key={product.id}
              entering={FadeInUp.delay(idx * 60).duration(500)}
              style={{ width: '48%', marginBottom: 20 }}
            >
              <Pressable
                onPress={() => router.push(`/produk/${product.id}` as any)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                })}
              >
                <View className="rounded-[1.5rem] overflow-hidden bg-secondary border border-border">
                  {/* Image */}
                  <View style={{ aspectRatio: 3 / 4, overflow: 'hidden', backgroundColor: '#f0e8e5' }}>
                    <Image
                      source={{ uri: product.imageUrl }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                    {/* Arrow overlay */}
                    <View className="absolute top-2.5 right-2.5 w-8 h-8 bg-white rounded-full items-center justify-center shadow">
                      <ArrowUpRight size={14} color="#0A0A0A" />
                    </View>
                    {/* Min order badge */}
                    {product.minOrder > 1 && (
                      <View className="absolute bottom-2.5 left-2.5 bg-black/50 rounded-full px-2 py-0.5">
                        <Text className="text-white text-[9px] font-bold">Min. {product.minOrder} pcs</Text>
                      </View>
                    )}
                  </View>

                  {/* Info */}
                  <View className="p-3.5">
                    <Text className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1" style={{ opacity: 0.7 }}>
                      {product.divisi.replace('_', ' ')}
                    </Text>
                    <Text className="text-sm font-bold text-foreground leading-tight mb-2" numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text className="text-[10px] text-foreground/40 mb-0.5">Mulai dari</Text>
                    <Text className="text-base font-extrabold text-primary">
                      Rp {Number(product.price).toLocaleString('id-ID')}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}
