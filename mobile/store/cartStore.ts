import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  customOptions?: Record<string, string>; // Dari database options (Bahan, Teknik, dll)
  customNote?: string;                    // Catatan bebas user
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const customStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(name) || null;
    } catch (e) {
      console.warn('AsyncStorage getItem error:', e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (e) {
      console.warn('AsyncStorage setItem error:', e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (e) {
      console.warn('AsyncStorage removeItem error:', e);
    }
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => set((state) => {
        const optionKey = JSON.stringify(newItem.customOptions ?? {});
        const existing = state.items.find(
          i => i.productId === newItem.productId && JSON.stringify(i.customOptions ?? {}) === optionKey
        );
        if (existing) {
          return {
            items: state.items.map(i =>
              i.id === existing.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
            )
          };
        }
        return { items: [...state.items, { ...newItem, id: Math.random().toString(36).substr(2, 9) }] };
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)
      })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, i) => total + i.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, i) => total + (i.price * i.quantity), 0),
    }),
    {
      name: 'tokraf-cart-storage-mobile',
      storage: createJSONStorage(() => customStorage),
    }
  )
);
