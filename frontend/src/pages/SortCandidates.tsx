import React, { useState, useEffect } from 'react';
import Table from '../components/Table';

const SortCandidates: React.FC = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    // Fetch jobs from /hr/my_jobs
    // import { getMyJobs } from '../api/hr';
    // getMyJobs().then(setJobs);
    // Placeholder
    setJobs([]);
  }, []);

  useEffect(() => {
    if (selectedJob) {
      // Fetch applicants from /hr/my_jobs/{selectedJob}/applications
      // import { getJobApplications } from '../api/hr';
      // getJobApplications(selectedJob).then(setApplicants);
      // Placeholder
      setApplicants([]);
    }
  }, [selectedJob]);

  const handleExport = () => {
    // Export to /hr/export/{selectedJob}
    // import { exportApplications } from '../api/hr';
    // exportApplications(selectedJob);
    console.log('Exporting');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sort Candidates</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Select Job</label>
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Select a job</option>
          {jobs.map((job: any) => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>
      {selectedJob && (
        <>
          <Table data={applicants} columns={['Name', 'Email', 'Resume', 'Status']} />
          <button onClick={handleExport} className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Export to XLSX
          </button>
        </>
      )}
    </div>
  );
};

export default SortCandidates;
