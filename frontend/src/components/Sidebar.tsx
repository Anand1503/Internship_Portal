import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Internship Portal</h2>
      <ul>
        {user?.role === 'student' && (
          <>
            <li className="mb-2"><Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link></li>
            <li className="mb-2"><Link to="/search-internships" className="hover:text-gray-300">Search Internships</Link></li>
            <li className="mb-2"><Link to="/upload-resume" className="hover:text-gray-300">Upload Resume</Link></li>
          </>
        )}
        {user?.role === 'hr' && (
          <>
            <li className="mb-2"><Link to="/hr-dashboard" className="hover:text-gray-300">HR Dashboard</Link></li>
            <li className="mb-2"><Link to="/post-job" className="hover:text-gray-300">Post Job</Link></li>
            <li className="mb-2"><Link to="/sort-candidates" className="hover:text-gray-300">Sort Candidates</Link></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
