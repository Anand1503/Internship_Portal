import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { listMyJobs } from '../api/jobs';

interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  stipend?: number;
  description: string;
  min_qualifications?: string;
  expected_qualifications?: string;
  deadline: string;
  posted_at: string;
  posted_by_name: string;
}

const HRDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await listMyJobs();
        setJobs(data);
      } catch (error: any) {
        setError(error.response?.data?.detail || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">HR Dashboard</h1>
      <p>Welcome to the HR dashboard. Here you can manage internships and view applications.</p>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <Table data={jobs} columns={['title', 'company_name', 'location', 'stipend', 'deadline']} />
      )}
    </div>
  );
};

export default HRDashboard;
