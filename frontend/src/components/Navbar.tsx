import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ShoppingBag, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useTranslation } from '../hooks/useTranslation';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setSearchOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 120);
  }, [searchOpen]);

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
      navigate(`/layanan?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* ─── PREMIUM FLOATING PILL NAVBAR ─── */}
      <div
        className={`
          fixed z-50 left-0 right-0
          flex justify-center
          transition-all duration-500
          /* mobile: 12px gap, desktop: 16px */
          top-3 px-3 md:top-4 md:px-4
        `}
      >
        <nav
          className={`
            w-full max-w-[1280px]
            rounded-full
            transition-all duration-500
            flex items-center
            ${scrolled
              ? 'bg-background/98 shadow-[0_8px_40px_rgba(128,0,0,0.12)] backdrop-blur-2xl border border-border/60'
              : 'bg-background/90 shadow-[0_4px_24px_rgba(0,0,0,0.07)] backdrop-blur-xl border border-border/30'
            }
          `}
        >
          <div className="flex items-center justify-between w-full px-4 md:px-6 h-[52px] md:h-[58px]">

            {/* ── Logo ── */}
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[1.3rem] md:text-2xl font-heading font-extrabold text-primary tracking-tighter shrink-0 mr-3 md:mr-8 select-none"
            >
              TOKRAF
            </Link>

            {/* ── Desktop nav links ── */}
            <div className="hidden md:flex items-center gap-5 lg:gap-7 flex-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative text-foreground/65 hover:text-primary font-heading font-semibold text-[13px] lg:text-sm tracking-wide transition-colors group py-1"
                >
                  {t(link.name)}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* ── Desktop right ── */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">

              {/* Animated search bar */}
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.form
                    key="search-open"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    onSubmit={handleSearch}
                    className="relative overflow-hidden"
                  >
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Cari produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-secondary/60 border border-primary/20 rounded-full py-1.5 pl-8 pr-8 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:bg-background transition-colors"
                    />
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-primary/50" />
                    <button
                      type="button"
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                    >
                      <X size={13} />
                    </button>
                  </motion.form>
                ) : (
                  <motion.button
                    key="search-icon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-foreground/60 hover:text-primary transition-colors rounded-full hover:bg-secondary/50"
                    aria-label="Cari"
                  >
                    <Search size={17} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="p-2 text-foreground/60 hover:text-primary transition-colors rounded-full hover:bg-secondary/50"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-foreground/60 hover:text-primary transition-colors"
                aria-label="Keranjang"
              >
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Divider */}
              <div className="w-px h-5 bg-border/60" />

              {/* CTA */}
              <a
                href="https://wa.me/6281993294170"
                target="_blank"
                rel="noreferrer"
                className="bg-primary text-white px-4 lg:px-5 py-2 rounded-full font-heading font-bold text-xs lg:text-sm hover:opacity-90 active:scale-95 transition-all whitespace-nowrap shadow-md shadow-primary/20"
              >
                {t('navbar.orderNow')}
              </a>
            </div>

            {/* ── Mobile right ── */}
            <div className="md:hidden flex items-center gap-1.5">
              <button
                onClick={() => { setSearchOpen(!searchOpen); setIsOpen(false); }}
                className="p-1.5 text-foreground/70 hover:text-primary transition-colors"
                aria-label="Cari"
              >
                <Search size={19} />
              </button>
              <button
                onClick={toggleTheme}
                className="p-1.5 text-foreground/70 hover:text-primary transition-colors"
                aria-label="Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="relative p-1.5 text-foreground/70"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => { setIsOpen(!isOpen); setSearchOpen(false); }}
                className="p-1.5 text-primary ml-0.5"
                aria-label="Menu"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>

          {/* ── Mobile search bar — expands below pill ── */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="md:hidden w-full overflow-hidden px-4 pb-3"
              >
                <form onSubmit={handleSearch} className="relative">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Cari kaos, banner, merchandise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-secondary/60 border border-primary/20 rounded-full py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:bg-background transition-all"
                  />
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/50" />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* ─── MOBILE FULL-SCREEN MENU ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ top: '68px' }}
          >
            <div
              className="absolute inset-0 bg-background/98 backdrop-blur-2xl"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="relative z-10 flex flex-col h-full px-6 pt-6 pb-12 overflow-y-auto"
            >
              {/* Nav links */}
              <nav className="flex flex-col gap-0.5 flex-1">
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between py-4 border-b border-border/20 text-2xl font-heading font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {t(link.name)}
                      <span className="text-foreground/30 text-base">→</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile CTA */}
              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-foreground/60 text-sm font-medium py-2"
                >
                  {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                  Ganti Tema
                </button>
                <a
                  href="https://wa.me/6281993294170"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-primary text-white text-center py-4 rounded-2xl font-heading font-bold text-lg active:scale-95 transition-transform shadow-lg shadow-primary/20"
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
