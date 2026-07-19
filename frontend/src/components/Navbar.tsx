import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ShoppingBag, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useTranslation } from '../hooks/useTranslation';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useThemeStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => { setIsOpen(false); }, [location]);

  const links = [
    { name: 'navbar.home', path: '/' },
    { name: 'navbar.services', path: '/layanan' },
    { name: 'navbar.portfolio', path: '/portofolio' },
    { name: 'navbar.about', path: '/tentang' },
    { name: 'navbar.contact', path: '/kontak' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/layanan?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full md:top-4 md:left-1/2 md:-translate-x-1/2 md:w-[95%] lg:w-[90%] xl:w-[85%] max-w-[1280px] z-50 transition-all duration-500 md:rounded-full border-b md:border shadow-sm md:shadow-xl ${scrolled ? 'bg-background/95 backdrop-blur-2xl border-border/50 py-1' : 'bg-background/90 md:bg-background/60 backdrop-blur-md border-border/30 py-1.5 md:py-2'
      }`}>
      <div className="w-full px-4 md:px-6 xl:px-8">
        <div className="flex justify-between items-center h-12 md:h-16">

          {/* Kiri: Logo dengan Jarak yang Pas */}
          <div className="flex-shrink-0 pr-4 md:pr-6">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xl md:text-3xl font-heading font-extrabold text-primary tracking-tighter">
              TOKRAF
            </Link>
          </div>

          {/* Bagian Tengah & Kanan (Desktop Only) */}
          <div className="hidden md:flex items-center justify-between flex-1 gap-2 lg:gap-6">

            {/* Tengah: Menu Navigasi dengan Gap Seimbang */}
            <div className="flex items-center gap-x-3 lg:gap-x-6">
              {links.map((link) => (
                <Link key={link.name} to={link.path}
                  className="text-foreground/80 hover:text-primary font-heading font-semibold text-[13px] lg:text-[14px] tracking-wide transition-colors relative group py-2">
                  {t(link.name)}
                  <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Kanan: Alat Utilitas & Tombol Aksi */}
            <div className="flex items-center gap-x-2 lg:gap-x-4">
              {/* Search Bar Desktop */}
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  placeholder="Cari kaos, banner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-28 lg:w-36 xl:w-48 bg-secondary/50 border border-border/60 rounded-full py-1.5 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 group-focus-within:text-primary transition-colors" />
              </form>

              {/* Grup Ikon Fitur */}
              <div className="flex items-center gap-x-2 border-r border-border/60 pr-4 lg:pr-5">
                <button onClick={toggleTheme} className="text-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary/60" aria-label="Toggle Theme">
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Keranjang */}
                <button onClick={() => navigate('/cart')} className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Keranjang">
                  <ShoppingBag size={20} />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>

              {/* Tombol Utama */}
              <a href="https://wa.me/6281993294170" target="_blank" rel="noreferrer"
                className="bg-primary text-primary-foreground px-4 lg:px-5 py-2 lg:py-2.5 rounded-full font-heading font-bold text-xs lg:text-sm hover:bg-foreground hover:text-background transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
                {t('navbar.orderNow')}
              </a>
            </div>

          </div>

          {/* Tombol Menu Mobile */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => navigate('/cart')} className="relative p-1.5 text-foreground hover:text-primary" aria-label="Keranjang">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-primary p-1.5">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-2xl rounded-b-3xl overflow-hidden">
            <div className="px-6 py-6 flex flex-col space-y-4">
              
              {/* Search Bar Mobile */}
              <form onSubmit={handleSearch} className="relative mb-2">
                <input
                  type="text"
                  placeholder="Cari kaos, banner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary/50 border border-border/60 rounded-full py-3 pl-11 pr-4 text-base text-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
                />
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" />
              </form>

              {links.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)}
                  className="text-xl font-heading font-medium text-foreground hover:text-primary transition-colors">
                  {t(link.name)}
                </Link>
              ))}
              <div className="pt-4 border-t border-border/60 flex flex-col gap-3">
                <button onClick={toggleTheme} className="flex items-center gap-2 text-foreground font-medium text-sm py-2">
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} Ganti Tema
                </button>
                <a href="https://wa.me/6281993294170" target="_blank" rel="noreferrer"
                  className="bg-primary text-primary-foreground text-center py-3 rounded-full font-heading font-bold text-base">
                  {t('navbar.orderNow')}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
