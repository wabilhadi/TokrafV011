import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  customOptions?: Record<string, string>; // e.g. { bahan: "Cotton 30s", teknik: "DTF" }
  customNote?: string;                    // e.g. "Ukuran: S=5, M=10, L=5"
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

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (newItem) => set((state) => {
    // Items with same productId but different options are separate cart entries
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
    return { items: [...state.items, { ...newItem, id: Date.now().toString() }] };
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)
  })),
  clearCart: () => set({ items: [] }),
  getTotalItems: () => get().items.reduce((total, i) => total + i.quantity, 0),
  getTotalPrice: () => get().items.reduce((total, i) => total + (i.price * i.quantity), 0),
}));
