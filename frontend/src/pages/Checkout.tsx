import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const TOKRAF_WA = '6281234567890'; // Ganti dengan nomor WA Admin TOKRAF

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const buildWhatsAppMessage = () => {
    const itemLines = items.map((item, idx) =>
      `${idx + 1}. ${item.name} - ${item.quantity} pcs x Rp ${item.price.toLocaleString('id-ID')}`
    ).join('\n');

    const total = getTotalPrice().toLocaleString('id-ID');

    const message =
`Halo Admin TOKRAF! Saya ingin memesan produk berikut:

🛒 *DETAIL PESANAN:*
${itemLines}

💰 *TOTAL: Rp ${total}*

👤 *DATA PEMESAN:*
Nama: ${name || 'Guest'}

Mohon informasi ketersediaan, estimasi pengerjaan, dan instruksi pembayarannya ya. Terima kasih! 🙏`;

    return encodeURIComponent(message);
  };

  const handleSendOrder = () => {
    if (!name.trim()) {
      alert('Mohon masukkan nama Anda terlebih dahulu.');
      return;
    }
    setIsLoading(true);
    const encodedMsg = buildWhatsAppMessage();
    const waUrl = `https://wa.me/${TOKRAF_WA}?text=${encodedMsg}`;
    clearCart();
    window.open(waUrl, '_blank');
    navigate('/');
  };

  return (
    <div className="w-full bg-background min-h-screen pb-32 pt-32">
      <div className="max-w-[700px] mx-auto px-6 md:px-12">

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl md:text-7xl font-extrabold font-heading tracking-tighter text-foreground mb-4">
            Hampir selesai.
          </h1>
          <p className="text-foreground/50 text-lg mb-16">
            Masukkan nama Anda agar admin bisa menyapa dengan tepat.
          </p>
        </motion.div>

        {/* Name Field */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
          <label className="block text-xs font-bold uppercase tracking-widest text-foreground/50 mb-3">Nama Anda</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className="w-full bg-secondary border border-border rounded-2xl px-6 py-5 text-xl font-bold text-foreground placeholder:font-normal placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-all"
          />
        </motion.div>

        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-secondary rounded-3xl p-8 border border-border mb-10">
          <h3 className="font-bold text-lg mb-6">Ringkasan Pesanan</h3>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-foreground/80">
                <span className="flex-1 truncate pr-4">{item.quantity}× {item.name}</span>
                <span className="font-bold shrink-0">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-6 pt-6 flex justify-between items-center">
            <span className="font-bold text-xl">Total</span>
            <span className="text-2xl font-extrabold text-primary">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
          </div>
        </motion.div>

        {/* WA Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-10">
          <p className="font-bold text-green-800 mb-2">💬 Proses via WhatsApp</p>
          <p className="text-green-700 text-sm leading-relaxed">
            Setelah menekan tombol di bawah, WhatsApp akan terbuka dengan rekap pesanan lengkap. Admin akan segera merespons dengan informasi ongkir dan pembayaran.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.button
          onClick={handleSendOrder}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-6 rounded-full font-bold text-xl shadow-lg hover:bg-[#1DA851] transition-all disabled:opacity-50"
        >
          <MessageCircle size={26} />
          KIRIM PESANAN KE WHATSAPP
        </motion.button>
      </div>
    </div>
  );
}
