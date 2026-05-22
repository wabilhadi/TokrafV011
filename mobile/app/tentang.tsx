import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Animated, { FadeInUp } from 'react-native-reanimated';

const VALUES = [
  { emoji: '⚡', title: 'Cepat & Tepat', desc: 'Estimasi produksi akurat dan pengiriman on-time sesuai deadline kamu.' },
  { emoji: '✅', title: 'Kualitas Terjamin', desc: 'Material premium, QC ketat di setiap tahap produksi sebelum sampai ke tanganmu.' },
  { emoji: '💬', title: 'Konsultasi Gratis', desc: 'Tim kami siap membantu dari desain hingga pilihan bahan terbaik untuk kebutuhanmu.' },
  { emoji: '💰', title: 'Harga Transparan', desc: 'Tidak ada biaya tersembunyi. Semua harga jelas dari awal sebelum produksi dimulai.' },
];

const TEAM = [
  { name: 'Divisi Konveksi', desc: 'Ahli produksi pakaian custom — kaos, jaket, seragam, hoodie, jersey.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800' },
  { name: 'Divisi Merch', desc: 'Spesialis merchandise event — lanyard, tumbler, mug, ganci, dan lainnya.', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800' },
  { name: 'Divisi Printing', desc: 'Cetak banner, spanduk, sticker, kartu nama, poster, dan signage berkualitas.', image: 'https://images.unsplash.com/photo-1563690623230-0322ba6db7d4?q=80&w=800' },
];

export default function Tentang() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <Navbar />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40, paddingTop: 100 }}>

        {/* Hero */}
        <View className="px-6 mb-8">
          <Animated.Text entering={FadeInUp.duration(500)} className="text-6xl font-extrabold tracking-tighter text-foreground mb-4">
            Tentang{'\n'}TOKRAF.
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(100).duration(500)} className="text-lg font-light text-foreground/60 leading-relaxed">
            TOKRAF adalah unit bisnis kreatif di bawah Himpunan Mahasiswa Teknik Informatika (HMTIKa) Universitas Esa Unggul — menyediakan layanan konveksi, merchandise, dan digital printing berkualitas sejak 2018.
          </Animated.Text>
        </View>

        {/* Hero Image */}
        <Animated.View entering={FadeInUp.delay(200)} className="w-full aspect-video mb-10 overflow-hidden">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200' }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </Animated.View>

        {/* Stats */}
        <View className="px-6 mb-10">
          <View className="flex-row flex-wrap gap-4">
            {[
              { val: '500+', label: 'Klien Dilayani' },
              { val: '6 Thn', label: 'Pengalaman' },
              { val: '3', label: 'Divisi Layanan' },
              { val: '100%', label: 'Kepuasan Klien' },
            ].map(s => (
              <View key={s.label} className="w-[46%] bg-primary/5 border border-primary/10 rounded-2xl p-5">
                <Text className="text-3xl font-extrabold text-primary mb-1">{s.val}</Text>
                <Text className="text-xs font-bold text-foreground/50 uppercase tracking-widest">{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Visi Misi */}
        <View className="px-6 mb-10">
          <Animated.Text entering={FadeInUp.delay(250)} className="text-2xl font-extrabold text-foreground mb-4">Visi & Misi</Animated.Text>
          <View className="bg-primary rounded-3xl p-6 mb-4">
            <Text className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">VISI</Text>
            <Text className="text-white text-lg font-bold leading-relaxed">
              Menjadi platform produksi kreatif terpercaya yang mendukung ekosistem kampus dan UMKM dengan standar kualitas premium.
            </Text>
          </View>
          <View className="bg-secondary rounded-3xl p-6 border border-border">
            <Text className="text-foreground/50 text-xs font-bold uppercase tracking-widest mb-2">MISI</Text>
            <Text className="text-foreground/70 leading-relaxed">
              Memberikan layanan produksi berkualitas dengan proses transparan, harga kompetitif, dan pelayanan yang fast-response untuk setiap klien.
            </Text>
          </View>
        </View>

        {/* Nilai */}
        <View className="px-6 mb-10">
          <Text className="text-2xl font-extrabold text-foreground mb-6">Nilai Kami</Text>
          {VALUES.map((v, i) => (
            <Animated.View key={v.title} entering={FadeInUp.delay(300 + i * 80)} className="flex-row items-start gap-x-4 mb-5">
              <View className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center">
                <Text className="text-2xl">{v.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-foreground text-base mb-1">{v.title}</Text>
                <Text className="text-foreground/60 text-sm leading-relaxed">{v.desc}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Divisi */}
        <View className="px-6 mb-10">
          <Text className="text-2xl font-extrabold text-foreground mb-6">Divisi Kami</Text>
          <View className="gap-y-4">
            {TEAM.map((t, i) => (
              <Animated.View key={t.name} entering={FadeInUp.delay(400 + i * 80)} className="rounded-3xl overflow-hidden bg-secondary">
                <Image source={{ uri: t.image }} className="w-full h-40" resizeMode="cover" />
                <View className="p-5">
                  <Text className="text-lg font-bold text-foreground mb-1">{t.name}</Text>
                  <Text className="text-sm text-foreground/60 leading-relaxed">{t.desc}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <Animated.View entering={FadeInUp.delay(600)} className="mx-6 mt-4 bg-foreground rounded-3xl p-8 items-center">
          <Text className="text-background text-xl font-extrabold text-center mb-4">Siap mulai{'\n'}bekerja sama?</Text>
          <TouchableOpacity onPress={() => router.push('/layanan')} className="bg-primary px-8 py-4 rounded-full">
            <Text className="text-white font-bold text-base">Lihat Layanan</Text>
          </TouchableOpacity>
        </Animated.View>

        <Footer />
      </ScrollView>
    </View>
  );
}
