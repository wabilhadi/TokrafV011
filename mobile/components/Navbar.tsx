import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Menu, X, Search, ShoppingBag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  SlideInDown, SlideOutDown,
  FadeIn, FadeOut, FadeInUp,
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useCartStore } from '../store/cartStore';

const NAV_LINKS = [
  { href: '/',           label: 'Home' },
  { href: '/layanan',    label: 'Layanan' },
  { href: '/portofolio', label: 'Portofolio' },
  { href: '/tentang',    label: 'Tentang' },
  { href: '/kontak',     label: 'Kontak' },
];

interface NavbarProps {
  searchBarHidden?: boolean;
  onSearchPress?: () => void;
}

const BTN = {
  width: 40, height: 40, borderRadius: 20,
  backgroundColor: '#fff',
  borderWidth: 1, borderColor: 'rgba(0,0,0,0.09)',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 4,
  shadowOffset: { width: 0, height: 1 },
  elevation: 2,
};

export default function Navbar({ searchBarHidden, onSearchPress }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = useCartStore(s => s.getTotalItems());

  // On non-home pages search icon is ALWAYS visible.
  // On home page it follows the scroll-based prop.
  const isHomePage = pathname === '/';
  const showSearch = searchBarHidden !== undefined ? searchBarHidden : !isHomePage;

  const searchOpacity = useSharedValue(showSearch ? 1 : 0);
  const searchScale = useSharedValue(showSearch ? 1 : 0.7);

  useEffect(() => {
    const TIMING = { duration: 220, easing: Easing.out(Easing.cubic) };
    if (showSearch) {
      searchOpacity.value = withTiming(1, TIMING);
      searchScale.value = withTiming(1, TIMING);
    } else {
      searchOpacity.value = withTiming(0, { duration: 180, easing: Easing.in(Easing.cubic) });
      searchScale.value = withTiming(0.7, { duration: 180, easing: Easing.in(Easing.cubic) });
    }
  }, [showSearch]);

  const searchAnimStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
    transform: [{ scale: searchScale.value }],
    width: searchOpacity.value > 0.05 ? 40 : 0,
    marginRight: searchOpacity.value > 0.05 ? 8 : 0,
    overflow: 'hidden' as const,
  }));

  const navigate = (href: string) => {
    setIsOpen(false);
    setTimeout(() => router.push(href as any), 150);
  };

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      router.push('/layanan' as any);
    }
  };

  return (
    <>
      {/* ── Top Bar ── */}
      <BlurView
        intensity={90}
        tint="light"
        style={{
          paddingTop: Math.max(insets.top, 10),
          position: 'absolute',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0,0,0,0.06)',
        }}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}>
          {/* Logo */}
          <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.8}>
            <Text style={{ fontSize: 22, fontWeight: '800', letterSpacing: -0.5, color: '#0A0A0A' }}>
              TOKRAF<Text style={{ color: '#800000' }}>.</Text>
            </Text>
          </TouchableOpacity>

          {/* Right actions */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>

            {/* Search icon — always rendered, opacity/scale animated */}
            <Animated.View style={[searchAnimStyle, { alignItems: 'center', justifyContent: 'center' }]}>
              <TouchableOpacity
                onPress={handleSearchPress}
                activeOpacity={0.8}
                style={BTN}
                pointerEvents={showSearch ? 'auto' : 'none'}
              >
                <Search color="#0A0A0A" size={18} />
              </TouchableOpacity>
            </Animated.View>

            {/* Cart */}
            <TouchableOpacity
              onPress={() => router.push('/cart')}
              activeOpacity={0.8}
              style={[BTN, { marginRight: 8 }]}
            >
              <ShoppingBag color="#0A0A0A" size={19} />
              {cartCount > 0 && (
                <View style={{
                  position: 'absolute', top: -3, right: -3,
                  backgroundColor: '#800000',
                  width: 18, height: 18, borderRadius: 9,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Hamburger */}
            <TouchableOpacity onPress={() => setIsOpen(true)} activeOpacity={0.8} style={BTN}>
              <Menu color="#0A0A0A" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>

      {/* ── Bottom Sheet Menu ── */}
      <Modal visible={isOpen} animationType="none" transparent statusBarTranslucent>
        {/* Backdrop */}
        <Animated.View
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(200)}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <Pressable
            onPress={() => setIsOpen(false)}
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }}
          />
        </Animated.View>

        {/* Bottom sheet panel */}
        <Animated.View
          entering={SlideInDown.springify().damping(24).stiffness(180).mass(0.8)}
          exiting={SlideOutDown.duration(280).easing(Easing.in(Easing.cubic))}
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            backgroundColor: '#fff',
            borderTopLeftRadius: 32, borderTopRightRadius: 32,
            paddingBottom: Math.max(insets.bottom, 20) + 16,
            shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 32, elevation: 20,
          }}
        >
          {/* Drag handle */}
          <View style={{ alignItems: 'center', paddingTop: 14, paddingBottom: 6 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.12)' }} />
          </View>

          {/* Header row */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            paddingHorizontal: 28, paddingTop: 10, paddingBottom: 20,
            borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)',
          }}>
            <Text style={{ fontSize: 28, fontWeight: '800', letterSpacing: -0.8, color: '#0A0A0A' }}>
              Menu<Text style={{ color: '#800000' }}>.</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              style={{ width: 36, height: 36, backgroundColor: '#f0f0f0', borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}
            >
              <X color="#0A0A0A" size={18} />
            </TouchableOpacity>
          </View>

          {/* Menu items with stagger */}
          <View style={{ paddingHorizontal: 28, paddingTop: 8 }}>
            {/* Cart shortcut */}
            <Animated.View entering={FadeInUp.delay(60).duration(300).springify()}>
              <TouchableOpacity
                onPress={() => navigate('/cart')}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 14,
                  paddingVertical: 16,
                  borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
                }}
              >
                <View style={{ width: 40, height: 40, backgroundColor: 'rgba(128,0,0,0.08)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={20} color="#800000" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#0A0A0A', flex: 1 }}>Keranjang</Text>
                {cartCount > 0 && (
                  <View style={{ backgroundColor: '#800000', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 }}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Nav links */}
            {NAV_LINKS.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Animated.View
                  key={link.href}
                  entering={FadeInUp.delay(100 + index * 55).duration(300).springify()}
                >
                  <TouchableOpacity
                    onPress={() => navigate(link.href)}
                    style={{
                      flexDirection: 'row', alignItems: 'center',
                      paddingVertical: 16,
                      borderBottomWidth: index < NAV_LINKS.length - 1 ? 1 : 0,
                      borderBottomColor: 'rgba(0,0,0,0.05)',
                    }}
                  >
                    {isActive && (
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#800000', marginRight: 10 }} />
                    )}
                    <Text style={{
                      fontSize: 22, fontWeight: '700', letterSpacing: -0.4,
                      color: isActive ? '#800000' : '#0A0A0A',
                    }}>
                      {link.label}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}

