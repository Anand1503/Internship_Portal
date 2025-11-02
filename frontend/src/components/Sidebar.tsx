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
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:relative lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-900">
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
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200
                  ${isActive(item.href) 
                    ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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
              flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-red-600 
              hover:bg-red-50 transition-colors duration-200
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
