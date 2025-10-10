import React from 'react'

const SearchInternships: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Internships</h1>
      <input type="text" placeholder="Search..." className="p-2 border border-gray-300 rounded w-full mb-4" />
      {/* List internships */}
      <div>
        <p>No internships found.</p>
      </div>
    </div>
  )
}

export default SearchInternships
