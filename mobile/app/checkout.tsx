import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';
import Navbar from '../components/Navbar';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MessageCircle } from 'lucide-react-native';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const TOKRAF_WA = '6281234567890'; // Ganti dengan nomor WA Admin TOKRAF

export default function Checkout() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const buildWhatsAppMessage = () => {
    const itemLines = items.map((item, idx) =>
      `${idx + 1}. ${item.name} - ${item.quantity} pcs x Rp ${item.price.toLocaleString('id-ID')}`
    ).join('\n');

    const total = getTotalPrice().toLocaleString('id-ID');
    const userName = user?.name || '-';
    const userEmail = user?.email || '-';

    const message = 
`Halo Admin TOKRAF! Saya ingin memesan produk berikut:

🛒 *DETAIL PESANAN:*
${itemLines}

💰 *TOTAL: Rp ${total}*

👤 *DATA PEMESAN:*
Status: Akun Terdaftar
Nama: ${userName}
Email: ${userEmail}

Mohon informasi ketersediaan, estimasi pengerjaan, dan instruksi pembayarannya ya. Terima kasih! 🙏`;

    return encodeURIComponent(message);
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      Alert.alert('Keranjang Kosong', 'Tambahkan produk ke keranjang terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    const encodedMsg = buildWhatsAppMessage();
    const waUrl = `https://wa.me/${TOKRAF_WA}?text=${encodedMsg}`;

    try {
      const canOpen = await Linking.canOpenURL(waUrl);
      if (canOpen) {
        await Linking.openURL(waUrl);
        // Clear cart after opening WA
        Alert.alert(
          'Pesanan Dikirim! 🎉',
          'Keranjang Anda akan dikosongkan. Admin TOKRAF akan segera membalas pesan WhatsApp Anda.',
          [{ text: 'OK', onPress: () => { clearCart(); router.replace('/'); } }]
        );
      } else {
        Alert.alert('WhatsApp Tidak Ditemukan', 'Pastikan aplikasi WhatsApp sudah terinstal di HP Anda.');
      }
    } catch (e) {
      Alert.alert('Gagal', 'Tidak dapat membuka WhatsApp. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Navbar />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140, paddingTop: 100 }}>
        <View className="px-6 mb-8">
          <Animated.Text entering={FadeInUp.duration(600)} className="text-5xl font-extrabold tracking-tighter text-foreground mb-2">
            Konfirmasi.
          </Animated.Text>
          <Text className="text-foreground/60 text-lg">Periksa pesanan Anda sebelum dikirim.</Text>
        </View>

        {/* Order Summary */}
        <Animated.View entering={FadeInUp.delay(100)} className="px-6 mb-8">
          <Text className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-4">RINGKASAN PESANAN</Text>
          <View className="bg-secondary rounded-2xl p-6 border border-black/5">
            {items.map((item, idx) => (
              <View key={item.id} className="flex-row justify-between items-start py-4 border-b border-black/5 last:border-0">
                <View className="flex-1 pr-4">
                  <Text className="font-bold text-foreground text-base" numberOfLines={2}>{item.name}</Text>
                  <Text className="text-foreground/50 mt-1">{item.quantity} pcs</Text>
                </View>
                <Text className="font-bold text-foreground">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</Text>
              </View>
            ))}
            <View className="flex-row justify-between items-center pt-4 mt-2">
              <Text className="font-bold text-lg text-foreground">TOTAL</Text>
              <Text className="text-2xl font-extrabold text-primary">Rp {getTotalPrice().toLocaleString('id-ID')}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Logged-in User Info */}
        <Animated.View entering={FadeInUp.delay(200)} className="px-6 mb-6">
          <Text className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-4">DATA PEMESAN</Text>
          <View className="bg-secondary rounded-2xl p-6 border border-black/5">
            <Text className="text-foreground font-bold text-base mb-1">{user?.name}</Text>
            <Text className="text-foreground/60">{user?.email}</Text>
          </View>
        </Animated.View>

        {/* WA Info Box */}
        <Animated.View entering={FadeInUp.delay(300)} className="mx-6 bg-green-50 rounded-2xl p-6 border border-green-200">
          <Text className="text-green-800 font-bold text-sm mb-2">💬 Proses Selanjutnya via WhatsApp</Text>
          <Text className="text-green-700 text-sm leading-relaxed">
            Setelah Anda menekan tombol di bawah, WhatsApp akan terbuka secara otomatis dengan rekap pesanan lengkap. Admin TOKRAF akan membalas untuk konfirmasi ongkir dan pembayaran.
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Floating CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-black/5 p-6 pb-10 shadow-2xl">
        <TouchableOpacity
          onPress={handleCheckout}
          disabled={isLoading || items.length === 0}
          className={`w-full flex-row items-center justify-center gap-x-3 py-5 rounded-full shadow-lg ${(isLoading || items.length === 0) ? 'bg-foreground/40' : 'bg-[#25D366]'}`}
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
