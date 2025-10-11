import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { listMyJobs, listApplicants, exportApplicants } from '../api/jobs';

interface Job {
  id: number;
  title: string;
  company_name: string;
}

interface Applicant {
  applicant_name: string;
  resume_path: string;
  status: string;
  applied_at: string;
}

const SortCandidates: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      setError('');
      try {
        const data = await listMyJobs();
        setJobs(data);
      } catch (error: any) {
        setError(error.response?.data?.detail || 'Failed to load jobs');
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      const fetchApplicants = async () => {
        setLoadingApplicants(true);
        setError('');
        try {
          const data = await listApplicants(selectedJob);
          setApplicants(data);
        } catch (error: any) {
          setError(error.response?.data?.detail || 'Failed to load applicants');
        } finally {
          setLoadingApplicants(false);
        }
      };
      fetchApplicants();
    } else {
      setApplicants([]);
    }
  }, [selectedJob]);

  const handleExport = async () => {
    if (!selectedJob) return;
    setExporting(true);
    setError('');
    try {
      const blob = await exportApplicants(selectedJob);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applicants_job_${selectedJob}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to export');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sort Candidates</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700">Select Job</label>
        {loadingJobs ? (
          <p>Loading jobs...</p>
        ) : (
          <select
            value={selectedJob || ''}
            onChange={(e) => setSelectedJob(Number(e.target.value) || null)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Select a job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>{job.title} - {job.company_name}</option>
            ))}
          </select>
        )}
      </div>
      {selectedJob && (
        <>
          {loadingApplicants ? (
            <p>Loading applicants...</p>
          ) : (
            <Table data={applicants} columns={['applicant_name', 'resume_path', 'status', 'applied_at']} />
          )}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : 'Export to XLSX'}
          </button>
        </>
      )}
    </div>
  );
};

export default SortCandidates;
