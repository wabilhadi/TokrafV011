import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, Copy, Bookmark, MessageCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { calculateItemSubtotal } from '../lib/pricingEngine';
import { useState } from 'react';

export default function Cart() {
  const { items, updateQuantity, removeItem, duplicateItem, saveForLater } = useCartStore();
  const [waName, setWaName] = useState('');
  const [waNote, setWaNote] = useState('');
  const [showWAForm, setShowWAForm] = useState(false);

  // Calculate totals including discounts and surcharges
  let rawSubtotal = 0;
  let totalDiscount = 0;

  let grandTotal = 0;
  let totalItems = 0;

  const enrichedItems = items.map(item => {
    // Note: item.price is the base price including option mods, but NOT quantity discounted or production surcharged.
    const pricing = calculateItemSubtotal(item.price, item.quantity);
    
    rawSubtotal += (item.price * item.quantity);
    totalDiscount += pricing.discountAmount;

    grandTotal += pricing.grandTotal;
    totalItems += item.quantity;
    
    return { ...item, pricing };
  });

  const handleSendWA = (e: React.FormEvent) => {
    e.preventDefault();
    
    let message = `Halo Admin TOKRAF, saya ingin melakukan pemesanan.\n`;
    message += `================================\n\n`;
    
    enrichedItems.forEach((item, index) => {
      message += `PRODUK ${index + 1}\n`;
      message += `*${item.name}*\n`;
      
      if (item.customOptions) {
        Object.entries(item.customOptions).forEach(([k, v]) => {
          message += `- ${k}: ${v}\n`;
        });
      }
      

      
      if (item.customNote) {
        message += `- Catatan: ${item.customNote}\n`;
      }
      
      message += `- Qty: ${item.quantity} pcs\n`;
      message += `- Subtotal: Rp ${item.pricing.grandTotal.toLocaleString('id-ID')}\n\n`;
      message += `================================\n\n`;
    });
    
    message += `RINGKASAN PESANAN\n`;
    message += `- Total Item: ${totalItems} pcs\n`;
    message += `- Harga Dasar: Rp ${rawSubtotal.toLocaleString('id-ID')}\n`;
    if (totalDiscount > 0) message += `- Diskon Grosir: -Rp ${totalDiscount.toLocaleString('id-ID')}\n`;

    message += `\n*TOTAL KESELURUHAN: Rp ${grandTotal.toLocaleString('id-ID')}*\n\n`;
    
    message += `DATA PEMESAN\n`;
    message += `Nama: ${waName}\n`;
    if (waNote.trim()) {
      message += `Catatan Tambahan: ${waNote.trim()}\n`;
    }
    
    message += `\nMohon informasi ketersediaan dan instruksi pembayarannya. Terima kasih!`;

    const url = `https://wa.me/6281993294170?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setShowWAForm(false);
  };

  return (
    <div className="w-full bg-background min-h-screen pb-32 pt-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold font-heading tracking-tighter text-foreground mb-4"
        >
          Keranjang Anda.
        </motion.h1>
        <p className="text-foreground/50 text-lg mb-12">{items.length} macam produk dipilih</p>

        {items.length === 0 ? (
          <div className="text-center py-32 bg-secondary/30 rounded-3xl border border-border">
            <ShoppingBag size={64} className="text-foreground/20 mx-auto mb-8" />
            <p className="text-2xl font-light text-foreground/40 mb-10">Belum ada produk di keranjang.</p>
            <Link to="/layanan" className="bg-foreground text-background px-8 py-3.5 rounded-full font-bold hover:bg-primary transition-all shadow-lg hover:shadow-primary/30">
              Mulai Eksplorasi Katalog
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {enrichedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card border border-border p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-secondary shrink-0 border border-border">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`} 
                            alt={item.name} 
                            className="w-full h-full object-contain p-2 mix-blend-multiply" 
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <Link to={`/produk/${item.productId}`} className="font-bold text-xl text-foreground hover:text-primary transition-colors pr-8">
                            {item.name}
                          </Link>
                          <div className="text-right shrink-0">
                            <p className="font-extrabold text-xl text-primary">Rp {item.pricing.grandTotal.toLocaleString('id-ID')}</p>
                            {item.pricing.discountPercentage > 0 && (
                              <p className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded mt-1 inline-block">
                                Diskon {item.pricing.discountPercentage}%
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Configuration Pills */}
                        {item.customOptions && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {Object.entries(item.customOptions).map(([k, v]) => (
                              <span key={k} className="inline-flex items-center text-xs font-medium bg-secondary text-foreground/80 px-2.5 py-1 rounded-md border border-border">
                                <span className="opacity-50 mr-1">{k}:</span> {v}
                              </span>
                            ))}

                          </div>
                        )}
                        {item.customNote && (
                          <p className="text-sm text-foreground/60 mt-3 bg-secondary/50 p-2 rounded-lg italic text-left">
                            "{item.customNote}"
                          </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                          {/* Qty Controls */}
                          <div className="flex items-center gap-2 bg-secondary p-1 rounded-full border border-border">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-background flex items-center justify-center hover:text-primary shadow-sm transition-all"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-bold text-sm w-10 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-background flex items-center justify-center hover:text-primary shadow-sm transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button onClick={() => saveForLater(item.id)} className="p-2 text-foreground/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Simpan untuk Nanti">
                              <Bookmark size={18} />
                            </button>
                            <button onClick={() => duplicateItem(item.id)} className="p-2 text-foreground/40 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Duplikat Item">
                              <Copy size={18} />
                            </button>
                            <button onClick={() => removeItem(item.id)} className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-[2rem] p-8 sticky top-32 border-2 border-primary/20 shadow-xl z-20">
                <h3 className="font-heading font-extrabold text-2xl mb-6 flex items-center gap-2">
                  <Info size={20} className="text-primary" /> Ringkasan
                </h3>

                <div className="space-y-4 mb-6 text-sm font-medium border-b border-border pb-6">
                  <div className="flex justify-between text-foreground/70">
                    <span>Total Item</span>
                    <span>{totalItems} pcs</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Harga Dasar</span>
                    <span>Rp {rawSubtotal.toLocaleString('id-ID')}</span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-bold bg-green-50 p-2 rounded-lg mt-2 -mx-2">
                      <span>Total Diskon Grosir</span>
                      <span>- Rp {totalDiscount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-lg text-foreground/80">Total Tagihan</span>
                    <span className="text-3xl font-extrabold text-primary">Rp {grandTotal.toLocaleString('id-ID')}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <p className="text-xs text-right text-green-600 font-bold">Hemat Rp {totalDiscount.toLocaleString('id-ID')}!</p>
                  )}
                </div>

                {showWAForm ? (
                  <form onSubmit={handleSendWA} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                      <label className="block text-xs font-bold text-foreground/60 mb-1 uppercase tracking-wider">Nama Anda *</label>
                      <input required autoFocus
                        value={waName} onChange={e => setWaName(e.target.value)}
                        className="w-full bg-transparent border-b border-border py-2 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Masukkan nama pemesan"
                      />
                      <label className="block text-xs font-bold text-foreground/60 mt-4 mb-1 uppercase tracking-wider">Catatan Checkout</label>
                      <input
                        value={waNote} onChange={e => setWaNote(e.target.value)}
                        className="w-full bg-transparent border-b border-border py-2 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Misal: dikirim ke jogja, dll"
                      />
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition-all hover:scale-[1.02] shadow-lg shadow-green-500/20">
                      Kirim Pesanan ke WhatsApp <MessageCircle size={18} />
                    </button>
                    <button type="button" onClick={() => setShowWAForm(false)} className="w-full text-center text-sm font-bold text-foreground/50 hover:text-foreground">
                      Batal
                    </button>
                  </form>
                ) : (
                  <>
                    <button
                      onClick={() => setShowWAForm(true)}
                      className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-xl font-bold hover:bg-primary transition-all hover:scale-[1.02] shadow-lg shadow-foreground/20 active:scale-[0.98]"
                    >
                      Checkout via WhatsApp <MessageCircle size={18} />
                    </button>

                    <Link to="/layanan" className="block text-center text-foreground/50 hover:text-foreground font-bold text-sm transition-colors mt-6">
                      ← Tambah Produk Lain
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
