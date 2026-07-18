import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Footer() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeInUp.duration(600)}
      className="bg-primary pt-14 px-6 rounded-t-[3rem] mt-16 w-full"
      style={{ paddingBottom: Math.max(insets.bottom + 16, 32) }}
    >
      {/* Brand & Description */}
      <View className="mb-10">
        <Text className="text-5xl font-extrabold text-background tracking-tighter mb-4">TOKRAF.</Text>
        <Text className="text-xl font-light leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Menjadi mitra terbaik bagi kreator dan organisasi untuk mewujudkan identitas mereka melalui konveksi, merchandise, dan printing terpadu.
        </Text>
      </View>

      {/* Quick Links */}
      <View className="flex-row flex-wrap mb-10">
        <View className="w-1/2 pr-4 mb-6">
          <Text className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>LAYANAN</Text>
          <View className="gap-y-3">
            <TouchableOpacity onPress={() => router.push('/layanan?divisi=konveksi')}><Text className="text-base font-bold text-background">Konveksi</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/layanan?divisi=merch')}><Text className="text-base font-bold text-background">Merchandise</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/layanan?divisi=digital-printing')}><Text className="text-base font-bold text-background">Printing</Text></TouchableOpacity>
          </View>
        </View>

        <View className="w-1/2 mb-6">
          <Text className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>TAUTAN</Text>
          <View className="gap-y-3">
            <TouchableOpacity onPress={() => router.push('/tentang')}><Text className="text-base font-bold text-background">Tentang</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/portofolio')}><Text className="text-base font-bold text-background">Portofolio</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/kontak')}><Text className="text-base font-bold text-background">Kontak</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Contact Info */}
      <View className="mb-8">
        <Text className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>HUBUNGI KAMI</Text>
        <View className="gap-y-4">
          <TouchableOpacity onPress={() => Linking.openURL('https://maps.app.goo.gl/uGPBCTHhaXja93Zg8')} className="flex-row items-start gap-x-3 pr-4">
            <View className="mt-1"><MapPin color="#fff" size={16} /></View>
            <Text className="text-background text-base leading-snug flex-1">UNU Yogyakarta, Gamping, Sleman.</Text>
          </TouchableOpacity>

          <View className="flex-row items-center flex-wrap gap-x-5 gap-y-3">
            <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/6281993294170')} className="flex-row items-center gap-x-2">
              <Phone color="#fff" size={16} />
              <Text className="text-background text-base font-bold">WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:ekrafhimatika@gmail.com')} className="flex-row items-center gap-x-2">
              <Mail color="#fff" size={16} />
              <Text className="text-background text-base font-bold">Email</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com/tokraf_jogja')} className="flex-row items-center gap-x-2">
              <ArrowUpRight color="#fff" size={16} />
              <Text className="text-background text-base font-bold">Instagram</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Bar */}
      <View className="pt-5" style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' }}>
        <Text className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>© {new Date().getFullYear()} TOKRAF. All rights reserved.</Text>
      </View>
    </Animated.View>
  );
}
