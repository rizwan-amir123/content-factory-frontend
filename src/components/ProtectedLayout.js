import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

export default function ProtectedLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader />
      
      {/* Outlet acts as a window container where your protected sub-pages are mounted */}
      <main className="flex-1 w-full py-4 sm:py-2">
        <Outlet />
      </main>
      
      <AppFooter />
    </div>
  );
}
