import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Users, Image, MessageCircle, TrendingUp, ArrowUpRight } from 'lucide-react';
import api from '../../lib/api';

type Stats = {
  totalProducts: number;
  totalUsers: number;
  totalPortfolio: number;
  totalContacts: number;
  unreadContacts: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/stats')
      .then(r => setStats(r.data))
      .catch(() => setStats({ totalProducts: 0, totalUsers: 0, totalPortfolio: 0, totalContacts: 0, unreadContacts: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Produk', value: stats?.totalProducts ?? 0, icon: Package, color: 'from-blue-500 to-blue-600', href: '/admin/products' },
    { label: 'Pengguna Terdaftar', value: stats?.totalUsers ?? 0, icon: Users, color: 'from-violet-500 to-violet-600', href: '/admin/users' },
    { label: 'Portfolio', value: stats?.totalPortfolio ?? 0, icon: Image, color: 'from-amber-500 to-amber-600', href: '/admin/portfolio' },
    { label: 'Pesan Masuk', value: stats?.totalContacts ?? 0, icon: MessageCircle, color: 'from-emerald-500 to-emerald-600', href: '/admin/messages', badge: stats?.unreadContacts },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-heading font-extrabold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-foreground/50 mt-2">Selamat datang di panel admin TOKRAF.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link to={card.href} className="block group">
              <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    <card.icon size={22} className="text-white" />
                  </div>
                  <ArrowUpRight size={18} className="text-foreground/30 group-hover:text-primary transition-colors" />
                </div>
                {loading ? (
                  <div className="h-10 w-16 bg-muted rounded-lg animate-pulse mb-2" />
                ) : (
                  <div className="flex items-end gap-2 mb-1">
                    <p className="text-4xl font-extrabold font-heading text-foreground">{card.value}</p>
                    {(card.badge ?? 0) > 0 && (
                      <span className="mb-1 text-xs font-bold bg-red-500 text-white rounded-full px-2 py-0.5">
                        {card.badge} baru
                      </span>
                    )}
                  </div>
                )}
                <p className="text-sm text-foreground/50 font-medium">{card.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-2xl p-8">
        <h3 className="text-lg font-bold font-heading text-foreground mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" /> Aksi Cepat
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Tambah Produk', href: '/admin/products', icon: Package },
            { label: 'Tambah Portfolio', href: '/admin/portfolio', icon: Image },
            { label: 'Lihat Pengguna', href: '/admin/users', icon: Users },
            { label: 'Edit Konten', href: '/admin/content', icon: MessageCircle },
          ].map(action => (
            <Link
              key={action.label}
              to={action.href}
              className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary transition-all text-center group"
            >
              <action.icon size={28} className="text-primary/60 group-hover:text-primary transition-colors" />
              <span className="text-sm font-bold text-foreground/70 group-hover:text-foreground transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
