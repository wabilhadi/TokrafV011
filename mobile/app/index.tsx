import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <Navbar />
      
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* HERO SECTION */}
        <View className="h-screen items-center justify-center px-6 pt-20">
          <Animated.View entering={FadeInUp.delay(200).duration(1000)} className="items-center">
            <Text className="text-6xl font-extrabold text-foreground text-center leading-none tracking-tighter mb-4">
              WE BUILD <Text className="text-primary">YOUR IDEA</Text>
            </Text>
            <Text className="text-lg font-light text-center text-foreground/80 max-w-sm mb-8">
              Layanan cetak, konveksi, dan merchandise premium dengan standar eksekutif.
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/layanan')}
              className="bg-primary px-8 py-4 rounded-full"
            >
              <Text className="text-background font-bold text-lg">EXPLORE LAYANAN</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* THE DIVISIONS */}
        <View className="px-4 gap-y-4">
          
          {/* Konveksi */}
          <Animated.View entering={FadeInUp.delay(300)} className="bg-foreground rounded-3xl p-8 overflow-hidden h-96 justify-end relative">
            <View className="absolute inset-0 bg-black/50 z-10" />
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop' }} 
              className="absolute inset-0 w-full h-full opacity-50"
            />
            <View className="z-20">
              <Text className="text-white text-xs font-bold uppercase tracking-widest mb-2">01 / KONVEKSI</Text>
              <Text className="text-4xl font-extrabold text-white mb-2">Premium Apparel</Text>
              <Text className="text-white/80 mb-6">Seragam, PDH, Jaket, Kaos kualitas ekspor.</Text>
              <TouchableOpacity onPress={() => router.push('/layanan/konveksi')} className="bg-white self-start px-6 py-3 rounded-full">
                <Text className="text-black font-bold">SEE DETAILS</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Merchandise */}
          <Animated.View entering={FadeInUp.delay(400)} className="bg-foreground rounded-3xl p-8 overflow-hidden h-96 justify-end relative">
            <View className="absolute inset-0 bg-black/50 z-10" />
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1610943640030-22cba2bd11d3?q=80&w=1200&auto=format&fit=crop' }} 
              className="absolute inset-0 w-full h-full opacity-50"
            />
            <View className="z-20">
              <Text className="text-white text-xs font-bold uppercase tracking-widest mb-2">02 / MERCHANDISE</Text>
              <Text className="text-4xl font-extrabold text-white mb-2">Corporate Gifts</Text>
              <Text className="text-white/80 mb-6">Tumbler, Pin, Lanyard, Custom Packaging.</Text>
              <TouchableOpacity onPress={() => router.push('/layanan/merch')} className="bg-white self-start px-6 py-3 rounded-full">
                <Text className="text-black font-bold">SEE DETAILS</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* CTA */}
        <View className="bg-secondary mx-4 mt-12 rounded-3xl p-8 items-center">
          <Text className="text-4xl font-extrabold text-center mb-6">Start Your Project Today</Text>
          <TouchableOpacity 
            onPress={() => Linking.openURL('https://wa.me/6281234567890')}
            className="bg-foreground px-8 py-4 rounded-full"
          >
            <Text className="text-background font-bold text-lg">CONTACT ADMIN</Text>
          </TouchableOpacity>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}
