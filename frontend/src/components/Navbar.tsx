import React from 'react';
// import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  // const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Internship Portal</h1>
      <div>
        {/* <span>Welcome, {user?.name}</span> */}
        <button className="ml-4 bg-red-500 px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
