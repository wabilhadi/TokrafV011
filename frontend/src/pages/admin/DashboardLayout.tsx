import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Image as ImageIcon, LogOut, FileText } from 'lucide-react';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logout } = useAuthStore();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Portfolio', path: '/admin/portfolio', icon: ImageIcon },
    { name: 'Content', path: '/admin/content', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col fixed h-full z-10">
        <div className="p-6">
          <Link to="/" className="text-2xl font-heading font-extrabold text-primary tracking-tighter">
            TOKRAF<span className="text-foreground">.</span>
          </Link>
          <p className="text-xs text-foreground/50 mt-1 uppercase tracking-widest font-bold">Admin Panel</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-foreground/70 hover:bg-secondary hover:text-primary'}`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
