import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import api from '../../lib/api';

type Product = {
  id: string;
  name: string;
  description: string;
  divisi: string;
  price: string;
  status: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    divisi: 'KONVEKSI',
    price: '',
    minOrder: 1,
    status: 'ACTIVE'
  });

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setShowModal(false);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error('Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error('Delete failed');
      }
    }
  };

  const openEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description,
      divisi: product.divisi,
      price: product.price,
      minOrder: product.minOrder,
      status: product.status
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Products Management</h1>
          <p className="text-foreground/60">Manage your catalog, pricing, and details.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ name: '', description: '', divisi: 'KONVEKSI', price: '', minOrder: 1, status: 'ACTIVE' });
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-foreground transition-all"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-foreground/50">Loading products...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 font-bold text-sm tracking-widest text-primary/60 uppercase">Product Name</th>
                <th className="p-4 font-bold text-sm tracking-widest text-primary/60 uppercase">Division</th>
                <th className="p-4 font-bold text-sm tracking-widest text-primary/60 uppercase">Base Price</th>
                <th className="p-4 font-bold text-sm tracking-widest text-primary/60 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-foreground/50">No products found.</td>
                </tr>
              )}
              {products.map(p => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{p.name}</td>
                  <td className="p-4 text-foreground/70">{p.divisi.replace('_', ' ')}</td>
                  <td className="p-4 text-foreground/70">Rp {Number(p.price).toLocaleString('id-ID')}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal CRUD */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl rounded-[2rem] border border-border shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-heading font-bold text-foreground">{editingId ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-foreground/50 hover:text-primary"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold tracking-widest uppercase text-primary/60 mb-2">Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold tracking-widest uppercase text-primary/60 mb-2">Division</label>
                    <select value={formData.divisi} onChange={e => setFormData({...formData, divisi: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground">
                      <option value="KONVEKSI">Konveksi</option>
                      <option value="MERCH">Merchandise</option>
                      <option value="DIGITAL_PRINTING">Digital Printing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold tracking-widest uppercase text-primary/60 mb-2">Price (Rp)</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold tracking-widest uppercase text-primary/60 mb-2">Description</label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground"></textarea>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-border shrink-0 flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-bold text-foreground/70 hover:bg-muted">Cancel</button>
              <button type="submit" form="productForm" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-foreground">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
