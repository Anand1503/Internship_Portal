import React from 'react'

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Internship Portal</h2>
      {/* Navigation links skeleton */}
      <ul>
        <li className="mb-2"><a href="#" className="hover:text-gray-300">Dashboard</a></li>
        <li className="mb-2"><a href="#" className="hover:text-gray-300">Internships</a></li>
        <li className="mb-2"><a href="#" className="hover:text-gray-300">Profile</a></li>
      </ul>
    </div>
  )
}

export default Sidebar
