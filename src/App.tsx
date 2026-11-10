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
    <div className="min-h-screen bg-[#0c0a09] text-stone-100 flex flex-col font-sans select-none">
      {/* Floating Translucent Header */}
      <Navbar />

      {/* Main View Area: 100dvh for Feed/Map, scrollable for Saved/Portal */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        {activeTab === 'feed' && <TikTokFeed />}
        {activeTab === 'map' && <DiscoveryMap />}
        {activeTab === 'saved' && (
          <div className="pt-14 pb-20 sm:pt-16 sm:pb-8 min-h-screen overflow-y-auto">
            <SavedDishesView />
          </div>
        )}
        {activeTab === 'portal' && (
          <div className="pt-14 pb-20 sm:pt-16 sm:pb-8 min-h-screen overflow-y-auto">
            <RestaurantDashboard />
          </div>
        )}
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
