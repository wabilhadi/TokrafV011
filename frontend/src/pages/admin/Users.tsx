import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Users as UsersIcon } from 'lucide-react';
import api from '../../lib/api';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  whatsapp?: string;
  createdAt: string;
  _count: { orders: number };
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleVerify = async (id: string) => {
    try {
      await api.put(`/users/${id}/toggle-verify`);
      fetchUsers();
    } catch { alert('Gagal memperbarui status'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-extrabold text-foreground">Manajemen Pengguna</h1>
        <p className="text-foreground/50 mt-1">{users.length} pengguna terdaftar</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
        <input type="text" placeholder="Cari nama atau email..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:border-primary text-foreground" />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-foreground/40 animate-pulse">Memuat pengguna...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-primary/60">Nama</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-primary/60">Email</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-primary/60">Role</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-primary/60">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-primary/60">Bergabung</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-primary/60 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="p-12 text-center text-foreground/30">Tidak ada pengguna.</td></tr>
                ) : filtered.map(u => (
                  <motion.tr key={u.id} layout className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium text-foreground">{u.name}</td>
                    <td className="p-4 text-foreground/60 text-sm">{u.email}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-foreground/60'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${u.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {u.isVerified ? <><CheckCircle size={12} /> Terverifikasi</> : <><XCircle size={12} /> Belum Verifikasi</>}
                      </span>
                    </td>
                    <td className="p-4 text-foreground/40 text-sm">
                      {new Date(u.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => toggleVerify(u.id)}
                          className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                            u.isVerified
                              ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {u.isVerified ? 'Cabut Verifikasi' : 'Verifikasi Manual'}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
