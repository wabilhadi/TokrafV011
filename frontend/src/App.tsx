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
import ScrollToTop from './components/ScrollToTop';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import DashboardLayout from './pages/admin/DashboardLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminPortfolio from './pages/admin/Portfolio';
import AdminContent from './pages/admin/Content';
import AdminUsers from './pages/admin/Users';
import AdminMessages from './pages/admin/Messages';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ─── Public Routes ─── */}
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



        {/* ─── Admin Routes ─── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        {/* ─── 404 Fallback ─── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
