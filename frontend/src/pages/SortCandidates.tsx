import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { 
  Users, 
  Briefcase, 
  Download, 
  FileText, 
  Calendar, 
  XCircle,
  Filter,
  Eye
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  company_name: string;
  location?: string;
  deadline?: string;
}

interface Applicant {
  id: number;
  applicant_name: string;
  applicant_email?: string;
  resume_id?: number;
  resume_path: string;
  resume_title?: string;
  status: string;
  applied_at: string;
  internship_title?: string;
}

const SortCandidates: React.FC = () => {
  const [searchParams] = useSearchParams();
  const jobIdFromUrl = searchParams.get('jobId');
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | null>(jobIdFromUrl ? Number(jobIdFromUrl) : null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const { success, error: showError } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      setError('');
      try {
        const response = await api.hr.getMyJobs();
        setJobs(response.data);
      } catch (error: any) {
        setError(error.response?.data?.detail || 'Failed to load jobs');
        showError('Failed to load job postings');
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, [showError]);

  useEffect(() => {
    if (selectedJob) {
      const fetchApplicants = async () => {
        setLoadingApplicants(true);
        setError('');
        try {
          const response = await api.applications.getJobApplications(selectedJob);
          setApplicants(response.data);
        } catch (error: any) {
          setError(error.response?.data?.detail || 'Failed to load applicants');
          showError('Failed to load applicants for this job');
        } finally {
          setLoadingApplicants(false);
        }
      };
      fetchApplicants();
    } else {
      setApplicants([]);
    }
  }, [selectedJob, showError]);

  const handleExport = async () => {
    if (!selectedJob) return;
    setExporting(true);
    setError('');
    try {
      const response = await api.export.jobCandidates(selectedJob);
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const selectedJobData = jobs.find(job => job.id === selectedJob);
      a.download = `candidates_${selectedJobData?.title || 'job'}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      success('Candidate list exported successfully!');
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to export');
      showError('Failed to export candidate list');
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadResume = async (applicant: Applicant) => {
    try {
      if (applicant.resume_id) {
        const response = await api.resumes.download(applicant.resume_id);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${applicant.resume_title || applicant.applicant_name}_resume.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        showError('Resume ID not available');
      }
    } catch (error: any) {
      showError('Failed to download resume');
    }
  };

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      await api.hr.updateApplicationStatus(applicationId, newStatus);
      success(`Application status updated to ${newStatus}`);
      // Refresh applicants list
      if (selectedJob) {
        const response = await api.hr.getJobApplications(selectedJob);
        setApplicants(response.data);
      }
    } catch (error: any) {
      showError('Failed to update application status');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'accepted': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'rejected': 'bg-red-100 text-red-800',
    };
    return colors[status.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const selectedJobData = jobs.find(job => job.id === selectedJob);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-rose-300 bg-clip-text text-transparent mb-2">Sort Candidates</h1>
        <p className="text-gray-600 dark:text-dim-300">Review and manage applications for your job postings</p>
      </div>

      {/* Job Selection */}
      <div className="bg-white dark:bg-jet-900 rounded-xl shadow-soft p-6 border border-gray-200 dark:border-dim-700 hover:shadow-medium transition-all duration-300">
        <div className="flex items-center mb-4">
          <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-light-100">Select Job Posting</h3>
        </div>
        
        {loadingJobs ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedJob === job.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-medium'
                    : 'border-gray-200 dark:border-dim-600 hover:border-gray-300 dark:hover:border-dim-500 hover:bg-gray-50 dark:hover:bg-night-800'
                }`}
              >
                <h4 className="font-semibold text-gray-900 dark:text-light-100 mb-1">{job.title}</h4>
                <p className="text-sm text-gray-600 dark:text-dim-300 mb-2">{job.company_name}</p>
                {job.location && (
                  <p className="text-xs text-gray-500 dark:text-dim-400 flex items-center">
                    <Filter className="w-3 h-3 mr-1" />
                    {job.location}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Job Info and Export */}
      {selectedJob && selectedJobData && (
        <div className="bg-white dark:bg-jet-900 rounded-xl shadow-soft border border-gray-200 dark:border-dim-700 hover:shadow-medium transition-all duration-300">
          <div className="p-6 border-b border-gray-200 dark:border-dim-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-light-100 mb-1">
                  {selectedJobData.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-dim-300">{selectedJobData.company_name}</p>
              </div>
              <button
                onClick={handleExport}
                disabled={exporting || applicants.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>{exporting ? 'Exporting...' : 'Export XLSX'}</span>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {loadingApplicants ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-dim-300">Loading applicants...</p>
                </div>
              </div>
            ) : applicants.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-light-100">
                    {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
                  </h4>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Resume
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applicants.map((applicant) => (
                        <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {applicant.applicant_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {applicant.applicant_email}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {applicant.resume_title}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={applicant.status}
                              onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                              className={`px-3 py-1 text-sm font-medium rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${getStatusBadge(applicant.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{new Date(applicant.applied_at).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDownloadResume(applicant)}
                              className="text-primary-600 hover:text-primary-900 font-medium flex items-center space-x-1"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Resume</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">No applicants yet</p>
                <p className="text-gray-500 text-sm">Candidates will appear here once they apply to this position</p>
              </div>
            )}
          </div>
        </div>
      )}

      {error && !loadingJobs && !loadingApplicants && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SortCandidates;
