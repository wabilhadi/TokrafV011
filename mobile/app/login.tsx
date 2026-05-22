import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Coba koneksi ke backend, fallback ke guest mode
const API_URL = __DEV__
  ? 'http://192.168.1.7:5000/api'
  : 'https://api.tokraf.com/api';

export default function Login() {
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Gagal', 'Mohon isi email dan password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password }, { timeout: 5000 });
      if (response.data.token) {
        loginAction(response.data.user, response.data.token);
        router.canGoBack() ? router.back() : router.replace('/');
      }
    } catch (error: any) {
      // Offline mode: izinkan login sebagai guest jika backend tidak aktif
      if (!error.response || error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        Alert.alert(
          'Mode Offline',
          'Server sedang tidak aktif. Lanjut sebagai tamu?',
          [
            { text: 'Batal', style: 'cancel' },
            {
              text: 'Lanjut sebagai Tamu',
              onPress: () => {
                loginAction({ id: 'guest', name: email.split('@')[0] || 'Tamu', email, role: 'USER' }, 'guest-token');
                router.canGoBack() ? router.back() : router.replace('/');
              },
            },
          ]
        );
      } else {
        Alert.alert('Login Gagal', error.response?.data?.message || 'Email atau password salah.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 bg-secondary rounded-full items-center justify-center mb-8">
        <ArrowLeft color="#800000" size={24} />
      </TouchableOpacity>

      <Animated.Text entering={FadeInUp.duration(500)} className="text-5xl font-extrabold tracking-tighter text-foreground mb-3">
        Selamat{'\n'}Datang.
      </Animated.Text>
      <Animated.Text entering={FadeInUp.delay(100).duration(500)} className="text-foreground/60 text-lg mb-12">
        Login untuk melanjutkan pesanan Anda.
      </Animated.Text>

      <Animated.View entering={FadeInUp.delay(150).duration(500)} className="gap-y-4 mb-8">
        <View>
          <Text className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">Email</Text>
          <TextInput
            placeholder="nama@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="w-full bg-secondary px-5 py-4 rounded-2xl border border-border text-foreground text-base"
            placeholderTextColor="#999"
          />
        </View>
        <View>
          <Text className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">Password</Text>
          <TextInput
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="w-full bg-secondary px-5 py-4 rounded-2xl border border-border text-foreground text-base"
            placeholderTextColor="#999"
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(250).duration(500)}>
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className={`w-full py-5 rounded-full items-center ${isLoading ? 'bg-primary/50' : 'bg-primary'}`}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text className="text-white font-bold text-lg tracking-widest">LOGIN</Text>
          }
        </TouchableOpacity>

        <View className="flex-row justify-center mt-8">
          <Text className="text-foreground/60">Belum punya akun? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text className="text-primary font-bold">Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>

        {/* Guest checkout option */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 py-4 rounded-full border border-border items-center"
        >
          <Text className="text-foreground/60 font-medium">Lanjut Tanpa Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}
