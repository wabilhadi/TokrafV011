import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Gagal', 'Mohon isi email dan password Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.token) {
        loginAction(response.data.user, response.data.token);
        // Kembali ke halaman sebelumnya (biasanya checkout atau profil)
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Login Gagal', error.response?.data?.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 pt-20">
      <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 bg-secondary rounded-full items-center justify-center mb-8">
        <ArrowLeft color="#000" size={24} />
      </TouchableOpacity>

      <Animated.Text entering={FadeInUp.duration(600)} className="text-4xl font-extrabold tracking-tighter text-foreground mb-4">
        Selamat Datang.
      </Animated.Text>
      <Text className="text-foreground/60 text-lg mb-12">Login untuk melanjutkan pesanan Anda.</Text>

      <Animated.View entering={FadeInUp.delay(100)} className="gap-y-4 mb-8">
        <TextInput 
          placeholder="Email" 
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="w-full bg-secondary px-6 py-4 rounded-xl border border-black/5 font-bold text-foreground"
          placeholderTextColor="#999"
        />
        <TextInput 
          placeholder="Password" 
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="w-full bg-secondary px-6 py-4 rounded-xl border border-black/5 font-bold text-foreground"
          placeholderTextColor="#999"
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200)}>
        <TouchableOpacity 
          onPress={handleLogin}
          disabled={isLoading}
          className={`w-full py-5 rounded-full items-center shadow-lg ${isLoading ? 'bg-foreground/50' : 'bg-foreground'}`}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text className="text-background font-bold text-lg tracking-widest">LOGIN</Text>}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-8">
          <Text className="text-foreground/60">Belum punya akun? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text className="text-primary font-bold">Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
