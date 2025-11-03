import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Upload, 
  LogOut, 
  Briefcase,
  Users,
  User,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  roles: string[];
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const studentItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      roles: ['student']
    },
    {
      id: 'search',
      label: 'Search Internships',
      icon: Search,
      href: '/search',
      roles: ['student']
    },
    {
      id: 'upload',
      label: 'Upload Resume',
      icon: Upload,
      href: '/upload-resume',
      roles: ['student']
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      href: '/profile',
      roles: ['student']
    }
  ];

  const hrItems: SidebarItem[] = [
    {
      id: 'hr-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/hr-dashboard',
      roles: ['hr']
    },
    {
      id: 'post-job',
      label: 'Post Job',
      icon: Briefcase,
      href: '/post-job',
      roles: ['hr']
    },
    {
      id: 'sort-candidates',
      label: 'Sort Candidates',
      icon: Users,
      href: '/sort-candidates',
      roles: ['hr']
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      href: '/profile',
      roles: ['hr']
    }
  ];

  const allItems = [...studentItems, ...hrItems];
  const filteredItems = allItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileOpen(false);
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Mobile Menu Button - Top Header */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-jet-900 border-b border-dim-700 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-night-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-rose-400" />
          </button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-rose-400 to-rose-300 bg-clip-text text-transparent">
            Internship Portal
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-jet-900 to-night-900 border-r border-dim-700 shadow-lg transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:relative lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dim-700 bg-night-900">
          {!isCollapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-rose-300 bg-clip-text text-transparent">
              Internship Portal
            </h1>
          )}
          
          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-night-800"
          >
            <X className="w-5 h-5 text-dim-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive(item.href) 
                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md' 
                    : 'text-dim-300 hover:bg-rose-900 hover:text-rose-300'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer with logout */}
        <div className="p-4 border-t border-dim-700">
          <button
            onClick={handleLogout}
            className={`
              flex items-center space-x-3 w-full px-3 py-3 rounded-xl text-rose-400 
              hover:bg-rose-900 transition-all duration-200 hover:shadow-sm
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 hidden lg:flex items-center justify-center 
                     w-6 h-6 bg-jet-900 border border-dim-600 rounded-full shadow-sm"
        >
          <Menu className="w-3 h-3 text-rose-400" />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
