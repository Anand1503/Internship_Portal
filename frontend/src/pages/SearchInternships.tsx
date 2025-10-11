import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { searchInternships, applyForInternship } from '../api/internships';
import { listMyResumes } from '../api/resumes';

interface Internship {
  id: number;
  title: string;
  company_name: string;
  location: string;
  description: string;
  min_qualifications?: string;
  expected_qualifications?: string;
  deadline: string;
}

interface Resume {
  id: number;
  title: string;
  file_path: string;
}

const SearchInternships: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      setError('');
      try {
        const params = searchTerm ? { q: searchTerm } : {};
        const data = await searchInternships(params);
        setInternships(data);
      } catch (error: any) {
        const detail = error.response?.data?.detail;
        if (Array.isArray(detail)) {
          setError(detail.map((d: any) => d.msg).join(', ') || 'Failed to fetch internships');
        } else {
          setError(detail || 'Failed to fetch internships');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, [searchTerm]);

  const handleApply = async (internship: Internship) => {
    setSelectedInternship(internship);
    setModalOpen(true);
    setApplyError('');
    try {
      const resumesData = await listMyResumes();
      setResumes(resumesData);
    } catch (error: any) {
      setApplyError('Failed to load resumes');
    }
  };

  const handleSubmitApply = async () => {
    if (!selectedInternship || !selectedResumeId) return;
    setApplyLoading(true);
    setApplyError('');
    try {
      await applyForInternship({
        internship_id: selectedInternship.id,
        resume_id: selectedResumeId,
      });
      setModalOpen(false);
      setSelectedInternship(null);
      setSelectedResumeId(null);
      alert('Application submitted successfully');
    } catch (error: any) {
      setApplyError(error.response?.data?.detail || 'Application failed');
    } finally {
      setApplyLoading(false);
    }
  };

  const tableData = internships.map(internship => ({
    ...internship,
    actions: (
      <button
        onClick={() => handleApply(internship)}
        className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
      >
        Apply
      </button>
    ),
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Internships</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search internships..."
          className="p-2 border border-gray-300 rounded w-full max-w-md"
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table
          data={tableData}
          columns={['title', 'company_name', 'location', 'description', 'actions']}
        />
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Apply for {selectedInternship?.title}</h2>
            {applyError && <p className="text-red-500 mb-4">{applyError}</p>}
            <div className="mb-4">
              <label className="block text-gray-700">Select Resume</label>
              <select
                value={selectedResumeId || ''}
                onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a resume</option>
                {resumes.map(resume => (
                  <option key={resume.id} value={resume.id}>{resume.title}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="mr-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApply}
                disabled={applyLoading || !selectedResumeId}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {applyLoading ? 'Applying...' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInternships;
