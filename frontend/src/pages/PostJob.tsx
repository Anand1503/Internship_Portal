import React, { useState } from 'react';

const PostJob: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Post to /internships
    // import { postInternship } from '../api/internships';
    // postInternship({ title, description, company, location, duration });
    console.log('Posting job');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Post a Job</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default PostJob;
