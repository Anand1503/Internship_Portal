import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import { getApplications } from '../api/applications';

interface Application {
  internship_title: string;
  status: string;
  applied_at: string;
}

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (err) {
        setError('Failed to fetch applications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div className="p-4">Loading applications...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const tableData = applications.map(app => ({
    'Job Title': app.internship_title,
    'Status': app.status,
    'Applied Date': new Date(app.applied_at).toLocaleDateString()
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-xl">My Applications</h2>
        <Table data={tableData} columns={['Job Title', 'Status', 'Applied Date']} />
      </div>
    </div>
  );
};

export default Dashboard;
