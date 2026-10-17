import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
export function RootLayout() {
  const {
    pathname
  } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const titles: Record<string, string> = {
      '/': 'Explore',
      '/saved': 'Saved items',
      '/report': 'Report an item',
      '/about': 'About'
    };
    document.title = (pathname.startsWith('/items/') ? 'Item details' : titles[pathname] || 'FindIt') + ' | FindIt';
  }, [pathname]);
  return <div className="app-shell">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <Navbar />
    <main className="main-content" id="main-content" tabIndex={-1}>
      <Outlet />
    </main>
    <Footer />
  </div>;
}
