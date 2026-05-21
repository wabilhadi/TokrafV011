import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, ShoppingBag } from 'lucide-react-native';
import { useCartStore } from '../../store/cartStore';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // In a real app, fetch the product based on ID. We use a static dummy for now.
  const product = {
    id: 'd1', name: 'Premium Oversized Hoodie', basePrice: 250000, category: 'konveksi', description: 'High-end heavyweight cotton hoodie with custom embroidery. Perfect for streetwear brands and premium merchandise.',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop'
  };

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      quantity: 1,
      imageUrl: product.imageUrl
    });
    // Normally you might show a toast or feedback here
  };

  return (
    <View className="flex-1 bg-background">
      <Navbar />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Product Image Full Header */}
        <Animated.View entering={FadeInUp.duration(600)} className="w-full h-96 relative">
          <Image source={{ uri: product.imageUrl }} className="w-full h-full object-cover" />
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="absolute top-20 left-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full items-center justify-center border border-white/20"
          >
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
        </Animated.View>

        {/* Product Info */}
        <View className="px-6 pt-8">
          <Animated.View entering={FadeInUp.delay(200).duration(600)}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm font-bold uppercase tracking-widest text-primary">{product.category}</Text>
              <Text className="text-xl font-extrabold text-foreground">Rp {product.basePrice.toLocaleString('id-ID')}</Text>
            </View>
            <Text className="text-4xl font-extrabold text-foreground leading-tight mb-6">{product.name}</Text>
            <Text className="text-lg font-light text-foreground/70 mb-8 leading-relaxed">
              {product.description}
            </Text>
            
            <View className="flex-row gap-x-4">
              <TouchableOpacity 
                onPress={handleAddToCart}
                className="flex-1 bg-secondary py-5 rounded-full items-center shadow-sm border border-black/5"
              >
                <Text className="text-foreground font-bold text-lg tracking-widest">+ KERANJANG</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => router.push('/cart')}
                className="flex-1 bg-foreground py-5 rounded-full items-center shadow-lg"
              >
                <Text className="text-background font-bold text-lg tracking-widest">BELI SEKARANG</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}
