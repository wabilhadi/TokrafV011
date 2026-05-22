import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="layanan/index" />
      <Stack.Screen name="produk/[id]" />
      <Stack.Screen name="cart" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="portofolio" />
      <Stack.Screen name="tentang" />
      <Stack.Screen name="kontak" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
