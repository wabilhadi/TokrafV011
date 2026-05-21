import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function Portofolio() {
  const works = [
    { id: 1, title: 'Startup Summit Merch', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop' },
    { id: 2, title: 'Tech Expo Lanyard', image: 'https://images.unsplash.com/photo-1585435422896-e2603fc5c00e?q=80&w=1200&auto=format&fit=crop' },
    { id: 3, title: 'Corporate Uniform', image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200&auto=format&fit=crop' },
  ];

  return (
    <View className="flex-1 bg-background">
      <Navbar />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100, paddingTop: 100 }}>
        <View className="px-6 mb-12">
          <Animated.Text entering={FadeInUp.duration(600)} className="text-6xl font-extrabold tracking-tighter text-foreground mb-4">
            Portofolio.
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(100).duration(600)} className="text-xl font-light text-foreground/70">
            Selected works and projects we've built for our amazing clients.
          </Animated.Text>
        </View>

        <View className="px-4 gap-y-6">
          {works.map((work, index) => (
            <Animated.View key={work.id} entering={FadeInUp.delay(200 + index * 100).duration(600)}>
              <View className="w-full aspect-[4/3] bg-secondary rounded-3xl overflow-hidden mb-4">
                <Image source={{ uri: work.image }} className="w-full h-full object-cover" />
              </View>
              <Text className="text-2xl font-bold text-foreground pl-2">{work.title}</Text>
            </Animated.View>
          ))}
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}
