import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { Search, MapPin, Building2, Briefcase, X, Calendar, DollarSign } from 'lucide-react';

interface Internship {
  id: number;
  title: string;
  company_name: string;
  location: string;
  description: string;
  min_qualifications?: string;
  expected_qualifications?: string;
  deadline: string;
  stipend?: number;
}

interface Resume {
  id: number;
  title: string;
  file_path: string;
}

const SearchInternships: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const { success, error: showError } = useToast();

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      setError('');
      try {
        const params: any = {};
        if (searchTerm) params.q = searchTerm;
        if (locationFilter) params.location = locationFilter;
        if (companyFilter) params.company = companyFilter;
        
        const response = await api.internships.getAll(params);
        setInternships(response.data);
      } catch (error: any) {
        const detail = error.response?.data?.detail;
        if (Array.isArray(detail)) {
          setError(detail.map((d: any) => d.msg).join(', ') || 'Failed to fetch internships');
        } else {
          setError(detail || 'Failed to fetch internships');
        }
        showError('Failed to fetch internships');
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, [searchTerm, locationFilter, companyFilter, showError]);

  const handleApply = async (internship: Internship) => {
    setSelectedInternship(internship);
    setModalOpen(true);
    setApplyError('');
    try {
      const response = await api.resumes.getMyResumes();
      setResumes(response.data);
    } catch (error: any) {
      setApplyError('Failed to load resumes');
      showError('Failed to load resumes');
    }
  };

  const handleSubmitApply = async () => {
    if (!selectedInternship || !selectedResumeId) return;
    setApplyLoading(true);
    setApplyError('');
    try {
      await api.applications.apply(selectedInternship.id, selectedResumeId);
      setModalOpen(false);
      setSelectedInternship(null);
      setSelectedResumeId(null);
      success('Application submitted successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Application failed';
      setApplyError(errorMessage);
      showError(errorMessage);
    } finally {
      setApplyLoading(false);
    }
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days left`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-rose-300 bg-clip-text text-transparent mb-2">Search Internships</h1>
        <p className="text-gray-600 dark:text-dim-300">Find and apply to internship opportunities</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-jet-900 rounded-xl shadow-soft p-6 border border-gray-200 dark:border-dim-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dim-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dim-600 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all duration-200 bg-white dark:bg-night-800 text-gray-900 dark:text-light-100 placeholder-gray-400 dark:placeholder-dim-400 focus:bg-gray-50 dark:focus:bg-night-700"
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dim-400 w-5 h-5" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter by location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dim-600 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all duration-200 bg-white dark:bg-night-800 text-gray-900 dark:text-light-100 placeholder-gray-400 dark:placeholder-dim-400 focus:bg-gray-50 dark:focus:bg-night-700"
            />
          </div>
          
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dim-400 w-5 h-5" />
            <input
              type="text"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              placeholder="Filter by company..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dim-600 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all duration-200 bg-white dark:bg-night-800 text-gray-900 dark:text-light-100 placeholder-gray-400 dark:placeholder-dim-400 focus:bg-gray-50 dark:focus:bg-night-700"
            />
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setLocationFilter('');
              setCompanyFilter('');
            }}
            className="px-4 py-3 border border-gray-300 dark:border-dim-600 rounded-xl text-gray-700 dark:text-dim-300 hover:bg-rose-100 dark:hover:bg-rose-900 hover:text-rose-600 dark:hover:text-rose-300 transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-dim-300">Searching for internships...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-rose-50 dark:bg-rose-900 border border-rose-200 dark:border-rose-700 rounded-xl p-6 text-center">
          <p className="text-rose-700 dark:text-rose-300 font-medium">{error}</p>
        </div>
      )}

      {/* Internships Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {internships.length > 0 ? (
            internships.map((internship) => (
              <div key={internship.id} className="bg-white dark:bg-jet-900 rounded-xl shadow-soft border border-gray-200 dark:border-dim-700 hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-light-100 mb-2">
                        {internship.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-dim-300">
                        <div className="flex items-center space-x-1">
                          <Building2 className="w-4 h-4" />
                          <span>{internship.company_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{internship.location}</span>
                        </div>
                      </div>
                    </div>
                    {internship.stipend && (
                      <div className="flex items-center space-x-1 text-green-600 font-medium">
                        <DollarSign className="w-4 h-4" />
                        <span>{internship.stipend}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-dim-200 mb-4 line-clamp-3">
                    {internship.description}
                  </p>

                  {/* Qualifications */}
                  {internship.min_qualifications && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-light-100 mb-2">Minimum Qualifications:</h4>
                      <p className="text-sm text-gray-600 dark:text-dim-300 line-clamp-2">{internship.min_qualifications}</p>
                    </div>
                  )}

                  {/* Deadline */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400 dark:text-dim-400" />
                      <span className="text-sm text-gray-600 dark:text-dim-300">Deadline:</span>
                      <span className={`text-sm font-medium ${
                        isDeadlinePassed(internship.deadline) ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {formatDeadline(internship.deadline)}
                      </span>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => handleApply(internship)}
                    disabled={isDeadlinePassed(internship.deadline)}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-sm ${
                      isDeadlinePassed(internship.deadline)
                        ? 'bg-dim-800 text-dim-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 hover:shadow-md'
                    }`}
                  >
                    {isDeadlinePassed(internship.deadline) ? 'Application Closed' : 'Apply Now'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-white dark:bg-jet-900 rounded-xl shadow-soft border border-gray-200 dark:border-dim-700 p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-400 dark:text-dim-400 mx-auto mb-4" />
              <p className="text-gray-700 dark:text-dim-300 font-medium text-lg mb-2">No internships found</p>
              <p className="text-gray-500 dark:text-dim-400">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      )}

      {/* Apply Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Apply for {selectedInternship?.title}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {applyError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700 text-sm">{applyError}</p>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Resume
                </label>
                <select
                  value={selectedResumeId || ''}
                  onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="">Select a resume</option>
                  {resumes.map(resume => (
                    <option key={resume.id} value={resume.id}>{resume.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApply}
                  disabled={applyLoading || !selectedResumeId}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-medium hover:from-primary-700 hover:to-primary-800 focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {applyLoading ? 'Applying...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInternships;
