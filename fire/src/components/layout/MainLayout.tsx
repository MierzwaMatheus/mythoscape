
import { Outlet, NavLink } from 'react-router-dom';
import { House, Settings } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row w-full">
      {/* Sidebar for Desktop/Tablet */}
      <aside className="hidden lg:flex lg:flex-col lg:w-20 bg-neutral-100 border-r border-neutral-300">
        <div className="p-4">
          <div className="h-12 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-semibold text-lg">M</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 pb-4">
          <div className="space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center justify-center h-12 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-neutral-600 hover:bg-neutral-200 hover:text-primary'
                }`
              }
            >
              <House className="w-6 h-6" />
            </NavLink>
            
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center justify-center h-12 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-neutral-600 hover:bg-neutral-200 hover:text-primary'
                }`
              }
            >
              <Settings className="w-6 h-6" />
            </NavLink>
          </div>
        </nav>
      </aside>

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-neutral-100 border-t border-neutral-300 z-50">
        <div className="flex">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 text-xs transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-neutral-600'
              }`
            }
          >
            <House className="w-6 h-6 mb-1" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 text-xs transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-neutral-600'
              }`
            }
          >
            <Settings className="w-6 h-6 mb-1" />
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 lg:py-8 pb-20 lg:pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
