import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowUpRight, Search, X } from 'lucide-react-native';

const TABS = [
  { id: 'all',              label: 'Semua',   dbValue: 'all' },
  { id: 'konveksi',         label: 'Konveksi', dbValue: 'KONVEKSI' },
  { id: 'merch',            label: 'Merch',    dbValue: 'MERCH' },
  { id: 'digital-printing', label: 'Printing', dbValue: 'DIGITAL_PRINTING' },
];

const SLUG_TO_DIVISI: Record<string, string> = {
  'konveksi': 'KONVEKSI',
  'merch': 'MERCH',
  'digital-printing': 'DIGITAL_PRINTING',
};

export default function Layanan() {
  const router = useRouter();
  const params = useLocalSearchParams<{ divisi?: string; category?: string; search?: string }>();
  const initialTab = params.divisi ?? params.category ?? 'all';

  const [activeTab, setActiveTab] = useState(SLUG_TO_DIVISI[initialTab] ?? 'all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(params.search ?? '');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<TextInput>(null);

  React.useEffect(() => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.46:5000';
    setLoading(true);
    const url = searchQuery.trim()
      ? `${apiUrl}/api/products?search=${encodeURIComponent(searchQuery.trim())}`
      : `${apiUrl}/api/products`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchQuery]);

  const filtered = activeTab === 'all'
    ? products
    : products.filter(p => p.divisi === activeTab);

  const pageTitle = searchQuery.trim()
    ? `Hasil: "${searchQuery}"`
    : TABS.find(t => t.dbValue === activeTab)?.label ?? 'Semua';

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Navbar — always show search icon on this page */}
      <Navbar
        searchBarHidden={true}
        onSearchPress={() => searchRef.current?.focus()}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 60, paddingTop: 88 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Page Header ── */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <Animated.Text
            entering={FadeInUp.duration(500)}
            style={{ fontSize: 28, fontWeight: '800', letterSpacing: -0.8, color: '#0A0A0A', marginBottom: 12 }}
          >
            {pageTitle}
            <Text style={{ color: '#800000' }}>.</Text>
          </Animated.Text>

          {/* ── Inline Search Bar ── */}
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: searchFocused ? '#fff' : '#F5F5F5',
            borderWidth: 1,
            borderColor: searchFocused ? '#800000' : 'transparent',
            borderRadius: 12,
            paddingHorizontal: 14, paddingVertical: 9,
            marginBottom: 14,
          }}>
            <Search color={searchFocused ? '#800000' : '#aaa'} size={15} />
            <TextInput
              ref={searchRef}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Cari produk..."
              placeholderTextColor="#bbb"
              style={{ flex: 1, marginLeft: 8, fontSize: 13, color: '#0A0A0A' }}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X color="#bbb" size={14} />
              </TouchableOpacity>
            )}
          </View>

          {/* ── Filter Tabs ── */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {TABS.map(tab => {
                const isActive = activeTab === tab.dbValue;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => setActiveTab(tab.dbValue)}
                    activeOpacity={0.8}
                    style={{
                      paddingHorizontal: 14, paddingVertical: 6,
                      borderRadius: 50,
                      backgroundColor: isActive ? '#0A0A0A' : 'transparent',
                      borderWidth: 1,
                      borderColor: isActive ? '#0A0A0A' : 'rgba(0,0,0,0.12)',
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: isActive ? '#fff' : 'rgba(10,10,10,0.55)' }}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Result count */}
          {!loading && (
            <Text style={{ marginTop: 10, fontSize: 11, color: 'rgba(10,10,10,0.35)', fontWeight: '600', letterSpacing: 0.2 }}>
              {filtered.length} produk
            </Text>
          )}
        </View>

        {/* ── Products Grid ── */}
        {loading ? (
          <View style={{ paddingVertical: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#800000" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={{ paddingVertical: 60, alignItems: 'center', paddingHorizontal: 32 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#0A0A0A', marginBottom: 8 }}>Produk tidak ditemukan.</Text>
            <Text style={{ fontSize: 14, color: 'rgba(10,10,10,0.5)', textAlign: 'center' }}>Coba kata kunci lain atau pilih kategori berbeda.</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {filtered.map((product, idx) => (
              <Animated.View
                key={product.id}
                entering={FadeInUp.delay(idx * 50).duration(450)}
                style={{ width: '48%', marginBottom: 20 }}
              >
                <Pressable
                  onPress={() => router.push(`/produk/${product.id}` as any)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] })}
                >
                  <View style={{ borderRadius: 24, overflow: 'hidden', backgroundColor: '#F0E8E5', borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)' }}>
                    {/* Image */}
                    <View style={{ aspectRatio: 3 / 4, overflow: 'hidden' }}>
                      <Image
                        source={{ uri: product.imageUrl?.startsWith('http') ? product.imageUrl : `${process.env.EXPO_PUBLIC_API_URL}${product.imageUrl}` }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                      {/* Arrow */}
                      <View style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowUpRight size={14} color="#0A0A0A" />
                      </View>
                      {/* Min order */}
                      {product.minOrder > 1 && (
                        <View style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 50, paddingHorizontal: 8, paddingVertical: 3 }}>
                          <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>Min. {product.minOrder} pcs</Text>
                        </View>
                      )}
                    </View>

                    {/* Info */}
                    <View style={{ padding: 14 }}>
                      <Text style={{ fontSize: 9, fontWeight: '800', letterSpacing: 1, color: '#800000', marginBottom: 4, textTransform: 'uppercase' }}>
                        {product.divisi?.replace('_', ' ')}
                      </Text>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A0A0A', lineHeight: 18, marginBottom: 8 }} numberOfLines={2}>
                        {product.name}
                      </Text>
                      <Text style={{ fontSize: 10, color: 'rgba(10,10,10,0.45)', marginBottom: 2 }}>Mulai dari</Text>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: '#800000' }}>
                        Rp {Number(product.price).toLocaleString('id-ID')}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        )}

        <Footer />
      </ScrollView>
    </View>
  );
}
