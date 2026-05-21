import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Animated, { FadeInUp } from 'react-native-reanimated';
import axios from 'axios';

type Product = {
  id: string;
  name: string;
  basePrice: number;
  category: string;
  description: string;
  imageUrl: string | null;
};

// Fallback dummy products
const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'd1', name: 'Premium Oversized Hoodie', basePrice: 250000, category: 'konveksi', description: 'High-end heavyweight cotton hoodie with custom embroidery.',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'd2', name: 'Canvas Totebag Aesthetic', basePrice: 45000, category: 'merch', description: 'Durable canvas totebag with minimalist screen print.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'd3', name: 'Art Print Poster A3', basePrice: 20000, category: 'digital-printing', description: 'Gallery-quality fine art printing on textured paper.',
    imageUrl: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=1200&auto=format&fit=crop'
  }
];

export default function Layanan() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const tabs = [
    { id: 'all', label: 'ALL SERVICES' },
    { id: 'konveksi', label: 'KONVEKSI' },
    { id: 'merch', label: 'MERCH' },
    { id: 'digital-printing', label: 'PRINTING' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data?.length ? data : DUMMY_PRODUCTS);
      } catch (err) {
        setProducts(DUMMY_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <View className="flex-1 bg-background">
      <Navbar />
      
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100, paddingTop: 100 }}>
        <View className="px-6 mb-8">
          <Animated.Text entering={FadeInUp.duration(600)} className="text-6xl font-extrabold tracking-tighter mb-8 text-foreground">
            {activeCategory === 'all' ? 'All Services.' : `${activeCategory.toUpperCase()}.`}
          </Animated.Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveCategory(tab.id)}
                className={`px-6 py-3 rounded-full border mr-3 ${activeCategory === tab.id ? 'bg-foreground border-foreground' : 'bg-transparent border-foreground/20'}`}
              >
                <Text className={`font-bold tracking-widest ${activeCategory === tab.id ? 'text-background' : 'text-foreground'}`}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#C9A84C" className="mt-20" />
        ) : (
          <View className="px-4 flex-row flex-wrap justify-between">
            {filteredProducts.map((product, idx) => (
              <Animated.View 
                key={product.id} 
                entering={FadeInUp.delay(idx * 100).duration(600)}
                className="w-[48%] mb-8"
              >
                <TouchableOpacity onPress={() => router.push(`/produk/${product.id}` as any)}>
                  <View className="w-full aspect-[3/4] bg-secondary rounded-2xl overflow-hidden mb-3">
                    <Image 
                      source={{ uri: product.imageUrl?.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}` }} 
                      className="w-full h-full object-cover"
                    />
                  </View>
                  <Text className="text-lg font-bold text-foreground" numberOfLines={1}>{product.name}</Text>
                  <Text className="text-sm font-bold text-primary mt-1">Rp {product.basePrice.toLocaleString('id-ID')}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
        
        <Footer />
      </ScrollView>
    </View>
  );
}
