import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-night-900">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        <main className="p-4 sm:p-6 pt-16 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
