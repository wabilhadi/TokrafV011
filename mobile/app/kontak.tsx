import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Phone, Mail, MapPin } from 'lucide-react-native';

export default function Kontak() {
  return (
    <View className="flex-1 bg-background">
      <Navbar />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100, paddingTop: 100 }}>
        
        <View className="px-6 mb-12">
          <Animated.Text entering={FadeInUp.duration(600)} className="text-6xl font-extrabold tracking-tighter text-foreground mb-4">
            Kontak.
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(100).duration(600)} className="text-xl font-light text-foreground/70">
            Let's discuss your next big project.
          </Animated.Text>
        </View>

        <View className="px-6 gap-y-8">
          <Animated.View entering={FadeInUp.delay(200).duration(600)} className="flex-row items-center">
            <View className="w-16 h-16 bg-secondary rounded-full items-center justify-center mr-6">
              <Phone color="#000" size={24} />
            </View>
            <View>
              <Text className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-1">WhatsApp</Text>
              <Text className="text-xl font-bold text-foreground">+62 812-3456-7890</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).duration(600)} className="flex-row items-center">
            <View className="w-16 h-16 bg-secondary rounded-full items-center justify-center mr-6">
              <Mail color="#000" size={24} />
            </View>
            <View>
              <Text className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-1">Email</Text>
              <Text className="text-xl font-bold text-foreground">hello@tokraf.com</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(600)} className="flex-row items-center">
            <View className="w-16 h-16 bg-secondary rounded-full items-center justify-center mr-6">
              <MapPin color="#000" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-1">Office</Text>
              <Text className="text-xl font-bold text-foreground leading-tight">Jl. Sudirman No. 123, Jakarta Selatan, 12190</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500).duration(600)} className="mt-8">
            <TouchableOpacity 
              onPress={() => Linking.openURL('https://wa.me/6281234567890')}
              className="w-full bg-foreground py-5 rounded-full items-center shadow-lg"
            >
              <Text className="text-background font-bold text-lg tracking-widest">SEND MESSAGE</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}
