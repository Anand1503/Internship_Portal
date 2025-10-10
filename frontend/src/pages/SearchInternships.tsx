import React, { useState, useEffect } from 'react';
import Table from '../components/Table';

const SearchInternships: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    // Fetch internships from /internships?search={searchTerm}
    // import { getInternships } from '../api/internships';
    // getInternships({ search: searchTerm }).then(setInternships);
    // Placeholder
    setInternships([]);
  }, [searchTerm]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Internships</h1>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search internships..."
          className="p-2 border border-gray-300 rounded w-full max-w-md"
        />
      </div>
      <Table data={internships} columns={['Title', 'Company', 'Location', 'Duration']} />
    </div>
  );
};

export default SearchInternships;
