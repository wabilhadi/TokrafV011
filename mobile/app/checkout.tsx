import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';
import Navbar from '../components/Navbar';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MessageCircle } from 'lucide-react-native';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const TOKRAF_WA = '6281993294170';

export default function Checkout() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [guestName, setGuestName] = useState('');

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-2xl font-bold text-foreground mb-4">Keranjang Kosong</Text>
        <Text className="text-foreground/60 mb-8 text-center">Tambahkan produk ke keranjang terlebih dahulu.</Text>
        <TouchableOpacity onPress={() => router.push('/layanan')} className="bg-primary px-8 py-4 rounded-full">
          <Text className="text-white font-bold text-lg">MULAI BELANJA</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const senderName = isAuthenticated ? (user?.name ?? 'Pelanggan') : guestName;

  const buildWhatsAppMessage = () => {
    const itemLines = items.map((item, idx) => {
      let line = `${idx + 1}. *${item.name}*\n   ${item.quantity} pcs × Rp ${item.price.toLocaleString('id-ID')} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`;
      if (item.customOptions && Object.keys(item.customOptions).length > 0) {
        const opts = Object.entries(item.customOptions).map(([k, v]) => `${k}: ${v}`).join(', ');
        line += `\n   📋 ${opts}`;
      }
      if (item.customNote) line += `\n   📝 ${item.customNote}`;
      return line;
    }).join('\n\n');

    const total = getTotalPrice().toLocaleString('id-ID');
    const message =
`Halo Admin TOKRAF! 👋 Saya ingin memesan:

🛒 *DETAIL PESANAN:*
${itemLines}

💰 *TOTAL: Rp ${total}*

👤 *DATA PEMESAN:*
Nama: ${senderName || 'Tamu'}
${isAuthenticated && user?.email ? `Email: ${user.email}` : ''}

Mohon info ketersediaan, estimasi, dan cara pembayarannya ya. Terima kasih! 🙏`;

    return encodeURIComponent(message);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated && !guestName.trim()) {
      Alert.alert('Nama Diperlukan', 'Mohon masukkan nama Anda agar admin bisa menyapa.');
      return;
    }

    setIsLoading(true);
    const waUrl = `https://wa.me/${TOKRAF_WA}?text=${buildWhatsAppMessage()}`;
    try {
      const canOpen = await Linking.canOpenURL(waUrl);
      if (canOpen) {
        await Linking.openURL(waUrl);
        Alert.alert(
          'Pesanan Dikirim! 🎉',
          'Admin TOKRAF akan segera membalas. Keranjang akan dikosongkan.',
          [{ text: 'OK', onPress: () => { clearCart(); router.replace('/'); } }]
        );
      } else {
        Alert.alert('WhatsApp Tidak Ditemukan', 'Pastikan WhatsApp sudah terinstal di HP Anda.');
      }
    } catch {
      Alert.alert('Gagal', 'Tidak dapat membuka WhatsApp. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Navbar />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 160, paddingTop: 100 }}>

        <View className="px-6 mb-8">
          <Animated.Text entering={FadeInUp.duration(500)} className="text-5xl font-extrabold tracking-tighter text-foreground mb-2">
            Konfirmasi.
          </Animated.Text>
          <Text className="text-foreground/60 text-lg">Periksa pesanan Anda sebelum dikirim.</Text>
        </View>

        {/* Order Items */}
        <Animated.View entering={FadeInUp.delay(100)} className="px-6 mb-6">
          <Text className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-4">RINGKASAN PESANAN</Text>
          <View className="bg-secondary rounded-2xl p-5 border border-border">
            {items.map((item) => (
              <View key={item.id} className="py-4 border-b border-border last:border-0">
                <View className="flex-row justify-between items-start">
                  <Text className="font-bold text-foreground text-base flex-1 pr-4" numberOfLines={2}>{item.name}</Text>
                  <Text className="font-bold text-foreground">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</Text>
                </View>
                <Text className="text-foreground/50 text-sm mt-1">{item.quantity} pcs × Rp {item.price.toLocaleString('id-ID')}</Text>
                {item.customOptions && Object.keys(item.customOptions).length > 0 && (
                  <Text className="text-xs text-foreground/50 mt-1">
                    {Object.entries(item.customOptions).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                  </Text>
                )}
                {item.customNote ? <Text className="text-xs text-primary mt-0.5">{item.customNote}</Text> : null}
              </View>
            ))}
            <View className="flex-row justify-between items-center pt-4 mt-2">
              <Text className="font-bold text-lg text-foreground">TOTAL</Text>
              <Text className="text-2xl font-extrabold text-primary">Rp {getTotalPrice().toLocaleString('id-ID')}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Data Pemesan */}
        <Animated.View entering={FadeInUp.delay(200)} className="px-6 mb-6">
          <Text className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-4">DATA PEMESAN</Text>
          {isAuthenticated ? (
            <View className="bg-secondary rounded-2xl p-5 border border-border">
              <Text className="text-foreground font-bold text-base">{user?.name}</Text>
              <Text className="text-foreground/60">{user?.email}</Text>
              <Text className="text-xs text-primary mt-2">✓ Akun terdaftar</Text>
            </View>
          ) : (
            <View>
              <TextInput
                placeholder="Masukkan nama Anda"
                value={guestName}
                onChangeText={setGuestName}
                className="bg-secondary border border-border rounded-2xl px-5 py-4 text-foreground text-base mb-3"
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => router.push('/login')} className="bg-background border border-primary rounded-2xl py-3 items-center">
                <Text className="text-primary font-bold text-sm">Punya akun? Login sekarang</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* WA Info */}
        <Animated.View entering={FadeInUp.delay(300)} className="mx-6 bg-green-50 rounded-2xl p-5 border border-green-200">
          <Text className="text-green-800 font-bold text-sm mb-1">💬 Proses via WhatsApp</Text>
          <Text className="text-green-700 text-sm leading-relaxed">
            WhatsApp akan terbuka otomatis dengan rekap pesanan lengkap. Admin TOKRAF akan membalas untuk konfirmasi detail dan pembayaran.
          </Text>
        </Animated.View>

      </ScrollView>

      {/* Floating CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-border p-5 pb-8 shadow-2xl">
        <TouchableOpacity
          onPress={handleCheckout}
          disabled={isLoading}
          className={`w-full flex-row items-center justify-center gap-x-3 py-5 rounded-full ${isLoading ? 'bg-green-400' : 'bg-[#25D366]'}`}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <>
                <MessageCircle color="#fff" size={24} />
                <Text className="text-white font-bold text-xl tracking-widest">PESAN VIA WHATSAPP</Text>
              </>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}
