import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-light-100 dark:bg-night-900 lg:flex">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 min-h-screen">
        <main className="pt-16 px-4 pb-4 sm:pt-16 sm:px-6 sm:pb-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
