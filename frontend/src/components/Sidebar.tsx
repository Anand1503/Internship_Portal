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
      {/* Mobile Menu Button - Floating */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-6 right-6 z-50 lg:hidden p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:relative lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          {!isCollapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Internship Portal
            </h1>
          )}
          
          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
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
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
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
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`
              flex items-center space-x-3 w-full px-3 py-3 rounded-xl text-red-600 
              hover:bg-red-50 transition-all duration-200 hover:shadow-sm
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
                     w-6 h-6 bg-white border border-gray-300 rounded-full shadow-sm"
        >
          <Menu className="w-3 h-3 text-gray-600" />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
