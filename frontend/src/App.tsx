import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Layanan from './pages/Layanan';
import ProductDetail from './pages/ProductDetail';
import Portofolio from './pages/Portofolio';
import Tentang from './pages/Tentang';
import Kontak from './pages/Kontak';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import DashboardLayout from './pages/admin/DashboardLayout';
import AdminProducts from './pages/admin/Products';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route path="/layanan/:divisi" element={<Layanan />} />
          <Route path="/produk/:id" element={<ProductDetail />} />
          <Route path="/portofolio" element={<Portofolio />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<div><h1 className="text-3xl font-heading font-bold mb-4">Dashboard</h1><p>Welcome to TOKRAF Admin Panel.</p></div>} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="portfolio" element={<div><h1 className="text-3xl font-heading font-bold mb-4">Portfolio Management</h1><p>Coming soon...</p></div>} />
          <Route path="content" element={<div><h1 className="text-3xl font-heading font-bold mb-4">Content Management</h1><p>Coming soon...</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
