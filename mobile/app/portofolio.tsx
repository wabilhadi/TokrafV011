import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || 'https://tokraf-backend.vercel.app';
const API_URL = `${BACKEND_URL}/api`;

type Portfolio = {
  id: string;
  title: string;
  clientName?: string;
  divisi: string;
  images: { url: string }[];
};

const CATEGORY_COLOR: Record<string, string> = {
  'KONVEKSI': 'bg-primary/10',
  'MERCH': 'bg-blue-50',
  'DIGITAL_PRINTING': 'bg-green-50',
};

const TABS = [
  { id: 'all', label: 'Semua Karya' },
  { id: 'KONVEKSI', label: 'Konveksi' },
  { id: 'MERCH', label: 'Merchandise' },
  { id: 'DIGITAL_PRINTING', label: 'Printing' },
];

export default function Portofolio() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/portfolio`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setPortfolios(res.data);
        } else {
          setPortfolios([]);
        }
      })
      .catch(err => {
        console.error('Error fetching portfolio:', err);
        setPortfolios([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'all' ? portfolios : portfolios.filter(p => p.divisi === activeTab);

  const resolveUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
  };

  return (
    <View className="flex-1 bg-background">
      <Navbar />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40, paddingTop: 100 }}>

        <View className="px-6 mb-10">
          <Animated.Text entering={FadeInUp.duration(500)} className="text-6xl font-extrabold tracking-tighter text-foreground mb-3">
            Portofolio.
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(100).duration(500)} className="text-lg font-light text-foreground/60 leading-relaxed">
            Karya terpilih yang telah kami selesaikan untuk ratusan klien dari berbagai instansi, komunitas, dan brand.
          </Animated.Text>
        </View>

        {/* Stats row */}
        <Animated.View entering={FadeInUp.delay(150)} className="flex-row px-6 gap-x-4 mb-8">
          {[
            { val: '100+', label: 'Klien' },
            { val: '3 Divisi', label: 'Layanan' },
            { val: '2026', label: 'Berdiri' },
          ].map(s => (
            <View key={s.label} className="flex-1 bg-primary/5 rounded-2xl p-4 items-center">
              <Text className="text-2xl font-extrabold text-primary">{s.val}</Text>
              <Text className="text-xs text-foreground/50 font-bold uppercase tracking-widest">{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}>
            {TABS.map(tab => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-full border-2 ${activeTab === tab.id ? 'bg-foreground border-foreground' : 'bg-transparent border-border'
                  }`}
              >
                <Text className={`font-bold ${activeTab === tab.id ? 'text-background' : 'text-foreground'}`}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Portfolio grid */}
        <View className="px-4 flex-row flex-wrap justify-between gap-y-6 min-h-[300px]">
          {loading ? (
            <View className="w-full items-center justify-center py-20">
              <ActivityIndicator size="large" color="#800000" />
            </View>
          ) : filtered.length === 0 ? (
            <Animated.View entering={FadeInUp} className="w-full items-center justify-center py-10 bg-secondary rounded-3xl mx-2">
              <Text className="text-foreground/60 font-bold text-center">Belum ada karya di kategori ini.</Text>
            </Animated.View>
          ) : (
            filtered.map((work, index) => (
              <Animated.View key={work.id} style={{ width: '48%' }} entering={FadeInUp.delay(100 + (index % 5) * 80).duration(400)} exiting={FadeOutDown}>
                <View className="w-full aspect-square bg-secondary rounded-3xl overflow-hidden mb-2">
                  <Image source={{ uri: resolveUrl(work.images?.[0]?.url) }} className="w-full h-full" resizeMode="cover" />
                  <View className={`absolute top-2 left-2 ${CATEGORY_COLOR[work.divisi] ?? 'bg-white/90'} px-2 py-0.5 rounded-full border border-black/10`}>
                    <Text className="text-[9px] font-bold text-foreground/80">{work.divisi.replace('_', ' ')}</Text>
                  </View>
                </View>
                <View className="px-1">
                  <Text className="text-sm font-bold text-foreground mb-0.5" numberOfLines={2}>{work.title}</Text>
                  {work.clientName && (
                    <Text className="text-[10px] text-foreground/60 leading-relaxed font-bold" numberOfLines={1}>{work.clientName}</Text>
                  )}
                </View>
              </Animated.View>
            ))
          )}
        </View>

        {/* CTA */}
        <Animated.View entering={FadeInUp.delay(600)} className="mx-6 mt-12 bg-primary rounded-3xl p-8 items-center">
          <Text className="text-white text-2xl font-extrabold text-center mb-2">Mau jadi karya{'\n'}berikutnya?</Text>
          <Text className="text-white/70 text-sm text-center mb-6">Konsultasikan kebutuhanmu dengan tim TOKRAF sekarang.</Text>
          <TouchableOpacity
            onPress={() => router.push('/kontak')}
            className="bg-white px-8 py-4 rounded-full"
          >
            <Text className="text-primary font-bold text-base">Hubungi Kami</Text>
          </TouchableOpacity>
        </Animated.View>

        <Footer />
      </ScrollView>
    </View>
  );
}
