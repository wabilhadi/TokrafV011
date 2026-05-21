import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function Tentang() {
  return (
    <View className="flex-1 bg-background">
      <Navbar />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100, paddingTop: 100 }}>
        
        <View className="px-6 mb-12">
          <Animated.Text entering={FadeInUp.duration(600)} className="text-6xl font-extrabold tracking-tighter text-foreground mb-4">
            Tentang Kami.
          </Animated.Text>
        </View>

        <Animated.View entering={FadeInUp.delay(200).duration(600)} className="w-full aspect-video bg-secondary mb-12">
          <Image source={{ uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop' }} className="w-full h-full object-cover" />
        </Animated.View>

        <View className="px-6">
          <Animated.Text entering={FadeInUp.delay(300).duration(600)} className="text-3xl font-extrabold text-foreground mb-6 leading-tight">
            We are a creative production house specializing in premium merchandise & apparel.
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(400).duration(600)} className="text-lg font-light text-foreground/70 leading-relaxed mb-8">
            Berdiri sejak tahun 2018, TOKRAF telah melayani ratusan klien dari berbagai perusahaan, startup, dan instansi pemerintahan dalam memproduksi merchandise dan seragam berkualitas ekspor.
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(500).duration(600)} className="text-lg font-light text-foreground/70 leading-relaxed">
            Misi kami adalah memberikan standar kualitas terbaik dengan proses yang transparan, mudah, dan profesional.
          </Animated.Text>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}
