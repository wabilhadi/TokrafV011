import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWA from './FloatingWA';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      {/* pill offset: top-3(12px) + 52px height + 4px gap = 68px */}
      <main className="flex-grow" style={{ paddingTop: '68px' }}>
        <Outlet />
      </main>
      <FloatingWA />
      <Footer />
    </div>
  );
}
