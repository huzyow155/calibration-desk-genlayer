import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { AppWorkbench } from './components/app/AppWorkbench';
import { WalletModal } from './components/common/WalletModal';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Sync with browser URL path
  useEffect(() => {
    const syncPath = () => {
      const path = window.location.pathname;
      if (path === '/app' || path === '/workbench') {
        setCurrentView('app');
      } else {
        setCurrentView('landing');
      }
    };

    syncPath();
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  const handleNavigate = (view: 'landing' | 'app') => {
    setCurrentView(view);
    const newPath = view === 'app' ? '/app' : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#eef0f2] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(180,195,215,0.06),transparent)]" />

      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
      />

      {/* Main View: Two-page architecture with zero content overlap */}
      <main className="flex-1">
        {currentView === 'landing' ? (
          <LandingPage onLaunchWorkbench={() => handleNavigate('app')} />
        ) : (
          <AppWorkbench />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  );
};

export default App;
