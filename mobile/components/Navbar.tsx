import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Menu, X, ShoppingBag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeInRight, FadeOutRight, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { useCartStore } from '../store/cartStore';

const NAV_LINKS = [
  { href: '/',           label: 'Home' },
  { href: '/layanan',    label: 'Layanan' },
  { href: '/portofolio', label: 'Portofolio' },
  { href: '/tentang',    label: 'Tentang Kami' },
  { href: '/kontak',     label: 'Kontak' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = useCartStore(s => s.getTotalItems());

  const navigate = (href: string) => {
    setIsOpen(false);
    setTimeout(() => router.push(href as any), 150);
  };

  return (
    <>
      {/* ── Top Bar ── */}
      <BlurView
        intensity={85}
        tint="light"
        style={{
          paddingTop: Math.max(insets.top, 12),
          position: 'absolute',
          top: 0, left: 0, right: 0,
          zIndex: 100,
        }}
      >
        <View className="flex-row justify-between items-center px-5 pb-3">
          {/* Logo */}
          <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.8}>
            <Text className="text-2xl font-extrabold tracking-tighter text-foreground">
              TOKRAF<Text className="text-primary">.</Text>
            </Text>
          </TouchableOpacity>

          {/* Right actions */}
          <View className="flex-row items-center gap-x-2">
            {/* Cart */}
            <TouchableOpacity
              onPress={() => router.push('/cart')}
              className="w-10 h-10 bg-white rounded-full items-center justify-center border border-black/10 shadow-sm"
              activeOpacity={0.8}
            >
              <ShoppingBag color="#0A0A0A" size={18} />
              {cartCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-primary w-5 h-5 rounded-full items-center justify-center">
                  <Text className="text-white text-[9px] font-extrabold">{cartCount > 9 ? '9+' : cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Hamburger */}
            <TouchableOpacity
              onPress={() => setIsOpen(true)}
              className="w-10 h-10 bg-white rounded-full items-center justify-center border border-black/10 shadow-sm"
              activeOpacity={0.8}
            >
              <Menu color="#0A0A0A" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>

      {/* ── Slide-in Menu ── */}
      <Modal visible={isOpen} animationType="none" transparent statusBarTranslucent>
        {/* Backdrop */}
        <Pressable
          onPress={() => setIsOpen(false)}
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        />

        {/* Drawer — slides in from right */}
        <Animated.View
          entering={SlideInRight.springify().damping(20).stiffness(180)}
          exiting={SlideOutRight.duration(200)}
          className="absolute right-0 top-0 bottom-0 bg-background"
          style={{ width: '75%', paddingTop: Math.max(insets.top, 20) }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pb-6 border-b border-border">
            <Text className="text-xl font-extrabold tracking-tighter text-foreground">
              TOKRAF<Text className="text-primary">.</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              className="w-10 h-10 bg-secondary rounded-full items-center justify-center"
              activeOpacity={0.8}
            >
              <X color="#0A0A0A" size={20} />
            </TouchableOpacity>
          </View>

          {/* Nav links */}
          <View className="flex-1 px-6 pt-8">
            {NAV_LINKS.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Animated.View key={link.href} entering={FadeInRight.delay(i * 60).duration(300)}>
                  <TouchableOpacity
                    onPress={() => navigate(link.href)}
                    className={`py-4 border-b border-border flex-row items-center justify-between ${isActive ? 'opacity-100' : 'opacity-70'}`}
                    activeOpacity={0.7}
                  >
                    <Text className={`text-2xl font-extrabold tracking-tighter ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {link.label}
                    </Text>
                    {isActive && (
                      <View className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}

            {/* Cart shortcut in menu */}
            <Animated.View entering={FadeInRight.delay(350).duration(300)} className="mt-8">
              <TouchableOpacity
                onPress={() => navigate('/cart')}
                className="bg-primary rounded-2xl p-5 flex-row items-center justify-between"
                activeOpacity={0.85}
              >
                <View>
                  <Text className="text-white font-extrabold text-lg">Keranjang</Text>
                  <Text className="text-white/70 text-sm">{cartCount} item</Text>
                </View>
                <ShoppingBag color="#fff" size={22} />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Footer nav */}
          <View className="px-6 pb-8 border-t border-border pt-6">
            <Text className="text-xs text-foreground/40 font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} TOKRAF
            </Text>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}
