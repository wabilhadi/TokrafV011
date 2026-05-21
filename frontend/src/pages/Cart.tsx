import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  return (
    <div className="w-full bg-background min-h-screen pb-32 pt-32">
      <div className="max-w-[900px] mx-auto px-6 md:px-12">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-extrabold font-heading tracking-tighter text-foreground mb-4"
        >
          Keranjang.
        </motion.h1>
        <p className="text-foreground/50 text-lg mb-16">{items.length} produk dipilih</p>

        {items.length === 0 ? (
          <div className="text-center py-32">
            <ShoppingBag size={64} className="text-foreground/20 mx-auto mb-8" />
            <p className="text-2xl font-light text-foreground/40 mb-10">Keranjang Anda masih kosong.</p>
            <Link to="/layanan" className="bg-foreground text-background px-10 py-5 rounded-full font-bold text-lg hover:bg-primary transition-all">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-0">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    exit={{ opacity: 0, x: -50 }}
                    className="flex items-center gap-6 py-8 border-b border-border"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-secondary shrink-0">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg text-foreground truncate">{item.name}</p>
                      <p className="text-primary font-bold mt-1">Rp {item.price.toLocaleString('id-ID')} / pcs</p>

                      {/* Qty Controls */}
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-primary/10 transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-primary/10 transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal + Remove */}
                    <div className="text-right shrink-0">
                      <p className="font-bold text-lg text-foreground">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-3 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-1">
              <div className="bg-secondary rounded-3xl p-8 sticky top-32 border border-border">
                <h3 className="font-bold text-xl mb-8">Ringkasan</h3>

                <div className="space-y-4 mb-8">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm text-foreground/70">
                      <span className="truncate pr-2">{item.quantity}× {item.name}</span>
                      <span className="shrink-0">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="text-2xl font-extrabold text-primary">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full flex items-center justify-center gap-3 bg-foreground text-background py-5 rounded-full font-bold text-lg hover:bg-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Lanjut Pesan <ArrowRight size={20} />
                </button>

                <Link to="/layanan" className="block text-center text-foreground/50 hover:text-foreground mt-6 text-sm transition-colors">
                  ← Lanjut Belanja
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
