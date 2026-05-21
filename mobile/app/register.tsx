import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.login);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !whatsapp || !password) {
      Alert.alert('Gagal', 'Semua kolom harus diisi.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        whatsapp,
        password,
        role: 'USER' // Mobile users are standard users
      });

      if (response.data.token) {
        loginAction(response.data.user, response.data.token);
        if (router.canGoBack()) {
          // Double pop to go back to checkout instead of login
          router.dismiss(2);
        } else {
          router.replace('/');
        }
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Pendaftaran Gagal', error.response?.data?.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: 80, paddingBottom: 100 }}>
      <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 bg-secondary rounded-full items-center justify-center mb-8">
        <ArrowLeft color="#000" size={24} />
      </TouchableOpacity>

      <Animated.Text entering={FadeInUp.duration(600)} className="text-4xl font-extrabold tracking-tighter text-foreground mb-4">
        Daftar Akun.
      </Animated.Text>
      <Text className="text-foreground/60 text-lg mb-12">Buat akun untuk melakukan pemesanan.</Text>

      <Animated.View entering={FadeInUp.delay(100)} className="gap-y-4 mb-8">
        <TextInput 
          placeholder="Nama Lengkap" 
          value={name}
          onChangeText={setName}
          className="w-full bg-secondary px-6 py-4 rounded-xl border border-black/5 font-bold text-foreground"
          placeholderTextColor="#999"
        />
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
          placeholder="Nomor WhatsApp" 
          value={whatsapp}
          onChangeText={setWhatsapp}
          keyboardType="phone-pad"
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
          onPress={handleRegister}
          disabled={isLoading}
          className={`w-full py-5 rounded-full items-center shadow-lg ${isLoading ? 'bg-foreground/50' : 'bg-foreground'}`}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text className="text-background font-bold text-lg tracking-widest">DAFTAR SEKARANG</Text>}
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}
