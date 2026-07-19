import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWA from './FloatingWA';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      {/* page-top uses the CSS variable --navbar-h defined in index.css */}
      <main className="flex-grow page-top">
        <Outlet />
      </main>
      <FloatingWA />
      <Footer />
    </div>
  );
}
