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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
    <>
      {/* ── NAVBAR ── */}
      <nav
        className={`
          fixed top-0 left-0 right-0 w-full z-50
          transition-all duration-300
          /* mobile: flush bar */
          border-b
          /* md+: floating pill */
          md:top-3 md:mx-auto md:left-4 md:right-4
          md:rounded-full md:border
          ${scrolled
            ? 'bg-background/95 backdrop-blur-2xl border-border/60 shadow-md'
            : 'bg-background/90 backdrop-blur-lg border-border/30 shadow-sm'
          }
        `}
        style={{ maxWidth: '1300px', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div className="flex items-center justify-between px-4 h-[52px] md:h-[60px] md:px-6">

          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[1.25rem] md:text-2xl font-heading font-extrabold text-primary tracking-tighter shrink-0"
          >
            TOKRAF
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-5 lg:gap-8 flex-1 justify-center">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-foreground/70 hover:text-primary font-heading font-semibold text-sm tracking-wide transition-colors relative group py-1"
              >
                {t(link.name)}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 xl:w-48 bg-secondary/60 border border-border/60 rounded-full py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:bg-background transition-all"
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/40" />
            </form>
            <button onClick={toggleTheme} className="p-2 text-foreground/70 hover:text-primary transition-colors rounded-full hover:bg-secondary/50" aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button onClick={() => navigate('/cart')} className="relative p-2 text-foreground/70 hover:text-primary transition-colors" aria-label="Cart">
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </button>
            <a
              href="https://wa.me/6281993294170"
              target="_blank"
              rel="noreferrer"
              className="bg-primary text-white px-4 py-2 rounded-full font-heading font-bold text-xs lg:text-sm hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
            >
              {t('navbar.orderNow')}
            </a>
          </div>

          {/* Mobile right actions */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-1.5 text-foreground/70" aria-label="Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => navigate('/cart')} className="relative p-1.5 text-foreground/70" aria-label="Cart">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-primary"
              aria-label="Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </nav>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ top: '52px' }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/98 backdrop-blur-2xl"
              onClick={() => setIsOpen(false)}
            />
            {/* Menu content */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 flex flex-col h-full px-6 pt-6 pb-10 overflow-y-auto"
            >
              {/* Search */}
              <form onSubmit={handleSearch} className="relative mb-6">
                <input
                  type="text"
                  placeholder="Cari kaos, banner, merchandise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-2xl py-3.5 pl-11 pr-4 text-base text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:bg-background transition-all"
                />
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              </form>

              {/* Nav links */}
              <nav className="flex flex-col gap-1 flex-1">
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between py-4 border-b border-border/30 text-2xl font-heading font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {t(link.name)}
                      <span className="text-foreground/30 text-base">→</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* CTA */}
              <div className="mt-8">
                <a
                  href="https://wa.me/6281993294170"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-primary text-white text-center py-4 rounded-2xl font-heading font-bold text-lg active:scale-95 transition-transform"
                >
                  {t('navbar.orderNow')} →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
