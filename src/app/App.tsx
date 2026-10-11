import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const App: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isWorkspace = pathname.startsWith('/room') || pathname.startsWith('/app') || pathname.startsWith('/builder');

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] text-text-primary selection:bg-primary-light selection:text-primary">
      {!isWorkspace && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isWorkspace && <Footer />}
    </div>
  );
};
