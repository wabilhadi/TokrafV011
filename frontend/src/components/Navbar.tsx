import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguageStore } from '../store/languageStore';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'navbar.home', path: '/' },
    { name: 'navbar.services', path: '/layanan' },
    { name: 'navbar.portfolio', path: '/portofolio' },
    { name: 'navbar.about', path: '/tentang' },
    { name: 'navbar.contact', path: '/kontak' },
  ];

  return (
    <nav className={`fixed top-4 left-4 right-4 md:left-8 md:right-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-fit lg:min-w-[70%] z-50 transition-all duration-500 rounded-full border shadow-2xl ${
      scrolled ? 'bg-background/95 backdrop-blur-2xl border-border/50 py-2' : 'bg-background/60 backdrop-blur-md border-border/30 py-4'
    }`}>
      <div className="w-full px-6 md:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-3xl md:text-4xl font-heading font-extrabold text-primary tracking-tighter"
            >
              TOKRAF.
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-foreground hover:text-primary font-heading font-semibold text-lg tracking-wide transition-colors relative group"
              >
                {t(link.name)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="text-foreground hover:text-primary transition-colors p-2 rounded-full bg-secondary/50"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={useLanguageStore.getState().toggleLanguage}
                className="text-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full bg-secondary/50 font-bold text-sm"
                aria-label="Toggle Language"
              >
                {language.toUpperCase()}
              </button>
            </div>
            {/* Cart Icon */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Keranjang"
            >
              <ShoppingBag size={26} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-heading font-bold text-lg hover:bg-foreground hover:text-background transition-all hover:scale-105 active:scale-95"
            >
              {t('navbar.orderNow')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={useLanguageStore.getState().toggleLanguage}
              className="text-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full bg-secondary/50 font-bold text-sm"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary p-2"
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-2xl"
          >
            <div className="px-6 py-8 flex flex-col space-y-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-heading font-bold text-foreground hover:text-primary transition-colors"
                >
                  {t(link.name)}
                </Link>
              ))}
              <div className="pt-6 border-t border-border flex flex-col gap-4">
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 text-2xl font-heading font-bold text-foreground hover:text-primary transition-colors"
                >
                  {theme === 'dark' ? <><Sun size={28} /> Light Mode</> : <><Moon size={28} /> Dark Mode</>}
                </button>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-center bg-primary text-primary-foreground px-8 py-4 rounded-full font-heading font-bold text-xl"
                >
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
