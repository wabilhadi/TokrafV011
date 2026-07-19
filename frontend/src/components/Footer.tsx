import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 rounded-t-[3rem] mt-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-8 lg:mb-12">

          <div className="lg:col-span-5">
            <Link to="/" className="text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tighter block mb-6">
              TOKRAF.
            </Link>
            <p className="text-pink-200 text-xl md:text-2xl font-heading font-light max-w-md leading-snug">
              {t('footer.desc')}
            </p>
          </div>

          {/* Menu disatukan dalam grid 2 kolom untuk mobile agar tidak terlalu panjang */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-10 lg:col-span-4">
            <div>
              <h3 className="font-sans text-xs md:text-sm tracking-widest text-pink-300 uppercase mb-4 lg:mb-6">{t('navbar.services')}</h3>
              <ul className="space-y-3 lg:space-y-4">
                <li><Link to="/layanan/konveksi" className="text-base md:text-xl font-heading hover:text-pink-200 transition-colors">Tokraf Konveksi</Link></li>
                <li><Link to="/layanan/merch" className="text-base md:text-xl font-heading hover:text-pink-200 transition-colors">Tokraf Merch</Link></li>
                <li><Link to="/layanan/digital-printing" className="text-base md:text-xl font-heading hover:text-pink-200 transition-colors">Printing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-sans text-xs md:text-sm tracking-widest text-pink-300 uppercase mb-4 lg:mb-6">{t('footer.quickLinks')}</h3>
              <ul className="space-y-3 lg:space-y-4">
                <li><Link to="/tentang" className="text-base md:text-xl font-heading hover:text-pink-200 transition-colors">{t('navbar.about')}</Link></li>
                <li><Link to="/portofolio" className="text-base md:text-xl font-heading hover:text-pink-200 transition-colors">{t('navbar.portfolio')}</Link></li>
                <li><Link to="/kontak" className="text-base md:text-xl font-heading hover:text-pink-200 transition-colors">{t('navbar.contact')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-sans text-xs md:text-sm tracking-widest text-pink-300 uppercase mb-4 lg:mb-6">{t('navbar.contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 md:gap-4 text-pink-100 group cursor-pointer">
                <MapPin size={20} className="shrink-0 mt-1" />
                <span className="text-sm md:text-lg leading-tight group-hover:text-white transition-colors">{t('kontak.address')}</span>
              </li>
              <li className="flex items-center gap-3 md:gap-4 text-pink-100 group cursor-pointer">
                <Phone size={20} className="shrink-0" />
                <span className="text-sm md:text-lg group-hover:text-white transition-colors">+62 819-9329-4170</span>
              </li>
              <li className="flex items-center gap-3 md:gap-4 text-pink-100 group cursor-pointer">
                <Mail size={20} className="shrink-0" />
                <span className="text-sm md:text-lg group-hover:text-white transition-colors">ekrafhimatika@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-pink-900/50 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
          <p className="text-pink-300 font-sans">
            &copy; {new Date().getFullYear()} TOKRAF. {t('footer.rights')}
          </p>
          <div className="flex gap-8 text-pink-300 font-sans">
            <a href="#" className="hover:text-white flex items-center gap-1">Instagram <ArrowUpRight size={14} /></a>
            <Link to="/admin" className="hover:text-white">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
