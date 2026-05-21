import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function Footer() {
  const router = useRouter();

  return (
    <Animated.View entering={FadeInUp.duration(600)} className="bg-primary pt-16 pb-12 px-6 rounded-t-[3rem] mt-16 w-full">
      {/* Brand & Description */}
      <View className="mb-12">
        <Text className="text-5xl font-extrabold text-background tracking-tighter mb-4">TOKRAF.</Text>
        <Text className="text-xl font-light text-background/80 leading-relaxed max-w-sm">
          Partner terpercaya untuk kebutuhan merchandise perusahaan, konveksi, dan digital printing premium.
        </Text>
      </View>

      {/* Quick Links */}
      <View className="flex-row flex-wrap mb-12">
        <View className="w-1/2 pr-4 mb-8">
          <Text className="text-xs font-bold uppercase tracking-widest text-background/60 mb-6">SERVICES</Text>
          <View className="gap-y-4">
            <TouchableOpacity onPress={() => router.push('/layanan/konveksi')}><Text className="text-lg font-bold text-background">Konveksi</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/layanan/merch')}><Text className="text-lg font-bold text-background">Merchandise</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/layanan/digital-printing')}><Text className="text-lg font-bold text-background">Printing</Text></TouchableOpacity>
          </View>
        </View>

        <View className="w-1/2 mb-8">
          <Text className="text-xs font-bold uppercase tracking-widest text-background/60 mb-6">LINKS</Text>
          <View className="gap-y-4">
            <TouchableOpacity onPress={() => router.push('/tentang')}><Text className="text-lg font-bold text-background">Tentang Kami</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/portofolio')}><Text className="text-lg font-bold text-background">Portofolio</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/kontak')}><Text className="text-lg font-bold text-background">Kontak</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Contact Info */}
      <View className="mb-12">
        <Text className="text-xs font-bold uppercase tracking-widest text-background/60 mb-6">CONTACT</Text>
        <View className="gap-y-6">
          <TouchableOpacity onPress={() => Linking.openURL('https://maps.google.com')} className="flex-row items-start gap-x-4 pr-4">
            <View className="mt-1"><MapPin color="#fff" size={20} /></View>
            <Text className="text-background text-lg leading-tight flex-1">Jl. Sudirman No. 123, Jakarta Selatan, 12190</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/6281234567890')} className="flex-row items-center gap-x-4">
            <Phone color="#fff" size={20} />
            <Text className="text-background text-lg">+62 812-3456-7890</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('mailto:hello@tokraf.com')} className="flex-row items-center gap-x-4">
            <Mail color="#fff" size={20} />
            <Text className="text-background text-lg">hello@tokraf.com</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Bar */}
      <View className="pt-8 border-t border-background/20 flex-col items-start gap-y-4">
        <Text className="text-background/70 text-sm">&copy; {new Date().getFullYear()} TOKRAF. All rights reserved.</Text>
        <TouchableOpacity className="flex-row items-center gap-x-1" onPress={() => Linking.openURL('https://instagram.com')}>
          <Text className="text-background/70 font-bold">Instagram</Text>
          <ArrowUpRight color="rgba(255,255,255,0.7)" size={14} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
