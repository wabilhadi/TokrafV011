import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Menu, X, ShoppingBag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const cartTotalItems = useCartStore((state) => state.getTotalItems());

  const links = [
    { href: '/', label: 'HOME' },
    { href: '/layanan', label: 'LAYANAN' },
    { href: '/portofolio', label: 'PORTOFOLIO' },
    { href: '/tentang', label: 'TENTANG KAMI' },
    { href: '/kontak', label: 'KONTAK' },
  ];

  return (
    <>
      <BlurView intensity={80} tint="light" style={{ paddingTop: Math.max(insets.top, 16) }} className="absolute top-0 left-0 right-0 z-50 flex-row justify-between items-center px-6 pb-4 border-b border-black/5">
        <Link href="/">
          <Text className="text-2xl font-extrabold tracking-tighter text-foreground">TOKRAF.</Text>
        </Link>
        
        <View className="flex-row items-center gap-x-4">
          <TouchableOpacity onPress={() => router.push('/cart')} className="relative w-12 h-12 bg-white rounded-full items-center justify-center border border-black/10 shadow-sm">
            <ShoppingBag color="#000" size={22} />
            {cartTotalItems > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-white text-[10px] font-bold">{cartTotalItems}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsOpen(true)} className="w-12 h-12 bg-white rounded-full items-center justify-center border border-black/10 shadow-sm">
            <Menu color="#000" size={24} />
          </TouchableOpacity>
        </View>
      </BlurView>

      <Modal visible={isOpen} animationType="slide" transparent={true}>
        <View className="flex-1 bg-background">
          <View style={{ paddingTop: Math.max(insets.top, 16) }} className="flex-row justify-between items-center px-6 pb-4 border-b border-black/10">
            <Text className="text-2xl font-extrabold tracking-tighter text-foreground">TOKRAF.</Text>
            <TouchableOpacity onPress={() => setIsOpen(false)} className="w-12 h-12 bg-black/5 rounded-full items-center justify-center">
              <X color="#000" size={24} />
            </TouchableOpacity>
          </View>
          
          <View className="flex-1 px-6 pt-12">
            {links.map((link, i) => (
              <TouchableOpacity 
                key={i} 
                className="py-6 border-b border-black/5"
                onPress={() => {
                  setIsOpen(false);
                  router.push(link.href as any);
                }}
              >
                <Text className="text-4xl font-extrabold text-foreground">{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}
