import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Navbar from '../components/Navbar';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react-native';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();

  return (
    <View className="flex-1 bg-background">
      <Navbar />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140, paddingTop: 100 }}>

        <View className="px-6 mb-8">
          <Animated.Text entering={FadeInUp.duration(500)} className="text-5xl font-extrabold tracking-tighter text-foreground mb-1">
            Keranjang.
          </Animated.Text>
          <Text className="text-foreground/50 text-lg">{getTotalItems()} item</Text>
        </View>

        {items.length === 0 ? (
          <Animated.View entering={FadeInUp.delay(100)} className="px-6 items-center justify-center py-24">
            <ShoppingBag color="#80000040" size={64} />
            <Text className="text-xl font-bold text-foreground/40 mt-6 mb-2">Keranjang masih kosong.</Text>
            <Text className="text-foreground/40 mb-8 text-center">Temukan produk yang kamu suka dan tambahkan ke sini!</Text>
            <TouchableOpacity onPress={() => router.push('/layanan')} className="bg-primary px-8 py-4 rounded-full">
              <Text className="text-white font-bold text-base tracking-widest">MULAI BELANJA</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View className="px-6">
            {items.map((item, idx) => (
              <Animated.View
                key={item.id}
                entering={FadeInUp.delay(idx * 80)}
                exiting={FadeOutDown}
                className="flex-row py-5 border-b border-border"
              >
                {/* Product image */}
                <Image
                  source={{ uri: item.imageUrl || 'https://placehold.co/200x200/ffe1e8/800000' }}
                  className="w-24 h-28 rounded-2xl bg-secondary"
                  resizeMode="cover"
                />

                <View className="flex-1 pl-4 justify-between">
                  <View>
                    <Text className="text-base font-bold text-foreground leading-tight" numberOfLines={2}>{item.name}</Text>

                    {/* Variant details */}
                    {item.customOptions && Object.keys(item.customOptions).length > 0 && (
                      <View className="mt-1 flex-row flex-wrap gap-1">
                        {Object.entries(item.customOptions).map(([k, v]) => (
                          <View key={k} className="bg-primary/10 rounded-full px-2 py-0.5">
                            <Text className="text-[10px] font-bold text-primary">{k}: {v}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    {item.customNote ? (
                      <Text className="text-[11px] text-foreground/50 mt-1" numberOfLines={2}>{item.customNote}</Text>
                    ) : null}

                    <Text className="text-primary font-bold mt-2">Rp {item.price.toLocaleString('id-ID')}</Text>
                  </View>

                  {/* Qty controls */}
                  <View className="flex-row items-center justify-between mt-3">
                    <View className="flex-row items-center bg-secondary rounded-full border border-border">
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 items-center justify-center"
                      >
                        <Minus color="#800000" size={14} />
                      </TouchableOpacity>
                      <Text className="font-bold text-foreground px-3">{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 items-center justify-center"
                      >
                        <Plus color="#800000" size={14} />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => removeItem(item.id)}
                      className="w-9 h-9 items-center justify-center bg-red-50 rounded-full"
                    >
                      <Trash2 color="#ef4444" size={16} />
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
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-border p-5 pb-8 shadow-2xl flex-row items-center justify-between">
          <View>
            <Text className="text-foreground/50 text-xs font-bold uppercase tracking-widest">TOTAL</Text>
            <Text className="text-2xl font-extrabold text-foreground">Rp {getTotalPrice().toLocaleString('id-ID')}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/checkout')}
            className="bg-primary px-8 py-4 rounded-full"
          >
            <Text className="text-white font-bold text-base tracking-widest">CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
