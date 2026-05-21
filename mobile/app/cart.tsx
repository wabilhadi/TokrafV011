import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Navbar from '../components/Navbar';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { Trash2, Minus, Plus } from 'lucide-react-native';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  return (
    <View className="flex-1 bg-background">
      <Navbar />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120, paddingTop: 100 }}>
        <View className="px-6 mb-8">
          <Animated.Text entering={FadeInUp.duration(600)} className="text-5xl font-extrabold tracking-tighter text-foreground mb-2">
            Keranjang.
          </Animated.Text>
          <Text className="text-foreground/60 text-lg">{items.length} Barang</Text>
        </View>

        {items.length === 0 ? (
          <View className="px-6 items-center justify-center py-20">
            <Text className="text-xl font-bold text-foreground/50 mb-6">Keranjang Anda masih kosong.</Text>
            <TouchableOpacity onPress={() => router.push('/layanan')} className="bg-primary px-8 py-4 rounded-full">
              <Text className="text-background font-bold text-lg tracking-widest">MULAI BELANJA</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="px-6">
            {items.map((item, idx) => (
              <Animated.View key={item.id} entering={FadeInUp.delay(idx * 100)} exiting={FadeOutDown} className="flex-row items-center py-6 border-b border-black/5">
                <Image source={{ uri: item.imageUrl }} className="w-24 h-24 rounded-xl bg-secondary" />
                <View className="flex-1 pl-4">
                  <Text className="text-lg font-bold text-foreground mb-1" numberOfLines={2}>{item.name}</Text>
                  <Text className="text-primary font-bold text-lg mb-3">Rp {item.price.toLocaleString('id-ID')}</Text>
                  
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center bg-secondary rounded-full border border-black/5">
                      <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 items-center justify-center">
                        <Minus color="#000" size={16} />
                      </TouchableOpacity>
                      <Text className="font-bold text-lg px-2">{item.quantity}</Text>
                      <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 items-center justify-center">
                        <Plus color="#000" size={16} />
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity onPress={() => removeItem(item.id)} className="w-10 h-10 items-center justify-center bg-red-50 rounded-full">
                      <Trash2 color="#ef4444" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Checkout Bar */}
      {items.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-black/5 p-6 pb-8 shadow-2xl flex-row items-center justify-between">
          <View>
            <Text className="text-foreground/60 text-sm font-bold uppercase tracking-widest">SUBTOTAL</Text>
            <Text className="text-2xl font-extrabold text-foreground">Rp {getTotalPrice().toLocaleString('id-ID')}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/checkout')} className="bg-foreground px-8 py-4 rounded-full">
            <Text className="text-background font-bold text-lg tracking-widest">CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
