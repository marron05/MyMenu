import React from 'react';
import { MenuProvider, useMenu } from './context/MenuContext';
import { Navbar } from './components/Navbar';
import { TikTokFeed } from './components/Feed/TikTokFeed';
import { DiscoveryMap } from './components/Map/DiscoveryMap';
import { RestaurantDashboard } from './components/RestaurantPortal/RestaurantDashboard';
import { SavedDishesView } from './components/Saved/SavedDishesView';
import { DishDetailsModal } from './components/Modals/DishDetailsModal';
import { RestaurantProfileModal } from './components/RestaurantDetail/RestaurantProfileModal';
import { FilterDrawer } from './components/Modals/FilterDrawer';
import { AuthModal } from './components/Auth/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { activeTab } = useMenu();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans select-none pb-14 sm:pb-0">
      {/* Top Navigation conforming to Top Bar Contract */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        {activeTab === 'feed' && <TikTokFeed />}
        {activeTab === 'map' && <DiscoveryMap />}
        {activeTab === 'saved' && <SavedDishesView />}
        {activeTab === 'portal' && <RestaurantDashboard />}
      </main>

      {/* Mobile Bottom Navigation (Ergonomic thumb zone) */}
      <MobileBottomNav />

      {/* Global Modals & Drawers */}
      <DishDetailsModal />
      <RestaurantProfileModal />
      <FilterDrawer />
      <AuthModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <MenuProvider>
      <AppContent />
    </MenuProvider>
  );
}
