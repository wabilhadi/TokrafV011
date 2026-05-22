import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Animated, { FadeInUp } from 'react-native-reanimated';

const PORTFOLIO = [
  { id: 1, category: 'Konveksi', title: 'Seragam Korsa HMJ 2024', desc: '200 pcs kemeja PDH American Drill bordir 5 titik untuk Himpunan Mahasiswa Jurusan.', image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200' },
  { id: 2, category: 'Merch', title: 'Goodie Bag Tech Summit', desc: 'Paket merchandise event: totebag, tumbler, lanyard, dan sticker custom 500 pcs.', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200' },
  { id: 3, category: 'Digital Printing', title: 'Dekorasi Pameran UMKM', desc: 'X-Banner, backdrop, dan banner outdoor untuk 12 booth peserta pameran.', image: 'https://images.unsplash.com/photo-1563690623230-0322ba6db7d4?q=80&w=1200' },
  { id: 4, category: 'Konveksi', title: 'Jersey Futsal Liga Kampus', desc: '16 tim × 15 pcs jersey full printing drifit Milano untuk turnamen antar kampus.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200' },
  { id: 5, category: 'Merch', title: 'Souvenir Wisuda 2024', desc: 'Mug sublimasi + lanyard ID card untuk 300 wisudawan Universitas.', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1200' },
  { id: 6, category: 'Konveksi', title: 'Hoodie Brand Streetwear', desc: 'Kolaborasi produksi 150 pcs hoodie oversize fleece cotton untuk brand lokal.', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200' },
];

const CATEGORY_COLOR: Record<string, string> = {
  'Konveksi': 'bg-primary/10',
  'Merch': 'bg-blue-50',
  'Digital Printing': 'bg-green-50',
};

export default function Portofolio() {
  const router = useRouter();

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
        <Animated.View entering={FadeInUp.delay(150)} className="flex-row px-6 gap-x-4 mb-10">
          {[
            { val: '500+', label: 'Klien' },
            { val: '3 Divisi', label: 'Layanan' },
            { val: '2018', label: 'Berdiri' },
          ].map(s => (
            <View key={s.label} className="flex-1 bg-primary/5 rounded-2xl p-4 items-center">
              <Text className="text-2xl font-extrabold text-primary">{s.val}</Text>
              <Text className="text-xs text-foreground/50 font-bold uppercase tracking-widest">{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Portfolio grid */}
        <View className="px-4 gap-y-6">
          {PORTFOLIO.map((work, index) => (
            <Animated.View key={work.id} entering={FadeInUp.delay(200 + index * 80).duration(500)}>
              <View className="w-full aspect-[4/3] bg-secondary rounded-3xl overflow-hidden mb-3">
                <Image source={{ uri: work.image }} className="w-full h-full" resizeMode="cover" />
                <View className={`absolute top-4 left-4 ${CATEGORY_COLOR[work.category] ?? 'bg-white/80'} px-3 py-1 rounded-full border border-white/30`}>
                  <Text className="text-xs font-bold text-foreground/70">{work.category}</Text>
                </View>
              </View>
              <View className="px-2">
                <Text className="text-xl font-bold text-foreground mb-1">{work.title}</Text>
                <Text className="text-sm text-foreground/60 leading-relaxed">{work.desc}</Text>
              </View>
            </Animated.View>
          ))}
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
