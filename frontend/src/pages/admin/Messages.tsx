import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Trash2, Check, MessageSquare } from 'lucide-react';
import api from '../../lib/api';

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/contact');
      setMessages(data);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id: string) => {
    try {
      await api.put(`/contact/${id}/read`);
      setMessages(m => m.map(msg => msg.id === id ? { ...msg, isRead: true } : msg));
    } catch { }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesan ini?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages(m => m.filter(msg => msg.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch { alert('Gagal menghapus'); }
  };

  const openMessage = (msg: Message) => {
    setSelected(msg);
    if (!msg.isRead) markRead(msg.id);
  };

  const unread = messages.filter(m => !m.isRead).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-extrabold text-foreground">Pesan Masuk</h1>
        <p className="text-foreground/50 mt-1">{messages.length} total — <span className="text-red-500 font-medium">{unread} belum dibaca</span></p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Message List */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-foreground/40 animate-pulse">Memuat pesan...</div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-foreground/30">
              <MessageSquare size={40} className="mx-auto mb-4 opacity-30" />
              <p>Belum ada pesan masuk.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`p-5 cursor-pointer hover:bg-muted/30 transition-colors flex items-start gap-4 ${
                    selected?.id === msg.id ? 'bg-primary/5 border-l-2 border-primary' : ''
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${msg.isRead ? 'bg-transparent' : 'bg-red-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-bold text-foreground truncate ${!msg.isRead ? 'text-foreground' : 'text-foreground/70'}`}>{msg.name}</p>
                      <span className="text-xs text-foreground/40 shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/50 truncate">{msg.email}</p>
                    <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div>
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-2xl p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold font-heading text-foreground">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-primary text-sm hover:underline">{selected.email}</a>
                  <p className="text-foreground/40 text-xs mt-1">
                    {new Date(selected.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
                <button onClick={() => handleDelete(selected.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-xl">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="bg-muted/50 rounded-2xl p-6 text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>
              <div className="mt-6 flex gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: Pesan dari TOKRAF`}
                  className="flex-1 bg-primary text-white font-bold py-3 rounded-xl text-center hover:bg-foreground transition-all flex items-center justify-center gap-2"
                >
                  <Mail size={18} /> Balas via Email
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-foreground/30">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
              <p>Pilih pesan untuk membacanya</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
