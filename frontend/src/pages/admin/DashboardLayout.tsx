import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Image as ImageIcon, LogOut, FileText, ArrowLeft, Users, MessageSquare } from 'lucide-react';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, logout } = useAuthStore();

  useEffect(() => {
    if (!token) navigate('/admin/login');
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Produk', path: '/admin/products', icon: Package },
    { name: 'Portfolio', path: '/admin/portfolio', icon: ImageIcon },
    { name: 'Pengguna', path: '/admin/users', icon: Users },
    { name: 'Pesan', path: '/admin/messages', icon: MessageSquare },
    { name: 'Konten', path: '/admin/content', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col fixed h-full z-10">
        {/* Logo */}
        <div className="p-6">
          <Link to="/" className="text-2xl font-heading font-extrabold text-primary tracking-tighter">
            TOKRAF<span className="text-foreground">.</span>
          </Link>
          <p className="text-xs text-foreground/40 mt-1 uppercase tracking-widest font-bold">Admin Panel</p>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-4 pb-4">
            <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                {user.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-foreground/40 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Back to Website */}
        <div className="px-4 pb-2">
          <Link to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-foreground/60 hover:text-primary hover:bg-secondary transition-colors">
            <ArrowLeft size={16} /> Kembali ke Website
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-foreground/70 hover:bg-secondary hover:text-primary'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
