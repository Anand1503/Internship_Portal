import React, { useEffect, useState } from 'react';
import Table from '../components/Table';

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Fetch applications from /applications/me
    // import { getApplications } from '../api/applications';
    // getApplications().then(setApplications);
    // Placeholder
    setApplications([]);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-xl">My Applications</h2>
        <Table data={applications} columns={['Job Title', 'Status', 'Applied Date']} />
      </div>
    </div>
  );
};

export default Dashboard;
