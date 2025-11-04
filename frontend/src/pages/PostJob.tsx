import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { Briefcase, Building2, MapPin, Calendar, DollarSign, FileText, Users, AlertCircle } from 'lucide-react';

const PostJob: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_name: '',
    location: '',
    min_qualifications: '',
    expected_qualifications: '',
    deadline: '',
    stipend: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.internships.create({
        ...formData,
        stipend: formData.stipend ? parseFloat(formData.stipend) : undefined
      });
      success('Job posted successfully!');
      navigate('/hr-dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to post job';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-rose-300 bg-clip-text text-transparent mb-2">Post New Internship</h1>
        <p className="text-gray-600 dark:text-dim-300">Create a new internship posting to attract qualified candidates</p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-jet-900 rounded-xl shadow-soft border border-gray-200 dark:border-dim-700">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-light-100 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dim-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Software Engineering Intern"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dim-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-night-800 text-gray-900 dark:text-light-100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dim-300 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dim-400 w-5 h-5" />
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Tech Corp Inc."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dim-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-night-800 text-gray-900 dark:text-light-100"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location and Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-light-100 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-600" />
              Location & Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dim-300 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dim-400 w-5 h-5" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., San Francisco, CA or Remote"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dim-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-night-800 text-gray-900 dark:text-light-100"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dim-300 mb-2">
                  Stipend (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dim-400 w-5 h-5" />
                  <input
                    type="number"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleInputChange}
                    placeholder="e.g., 2000"
                    min="0"
                    step="100"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dim-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-night-800 text-gray-900 dark:text-light-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-light-100 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary-600" />
              Application Deadline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dim-300 mb-2">
                  Deadline *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dim-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-night-800 text-gray-900 dark:text-light-100"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Deadline must be at least tomorrow</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-light-100 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              Job Description
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dim-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of the internship role, responsibilities, and what the candidate will be working on..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dim-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-night-800 text-gray-900 dark:text-light-100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-light-100 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-600" />
              Qualifications
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dim-300 mb-2">
                  Minimum Qualifications *
                </label>
                <textarea
                  name="min_qualifications"
                  value={formData.min_qualifications}
                  onChange={handleInputChange}
                  placeholder="List the minimum requirements candidates must have (e.g., Currently enrolled in a computer science program, Basic programming knowledge, etc.)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dim-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-night-800 text-gray-900 dark:text-light-100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dim-300 mb-2">
                  Expected Qualifications *
                </label>
                <textarea
                  name="expected_qualifications"
                  value={formData.expected_qualifications}
                  onChange={handleInputChange}
                  placeholder="List preferred qualifications that would make a candidate ideal (e.g., Experience with specific technologies, Previous internship experience, etc.)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dim-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-night-800 text-gray-900 dark:text-light-100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">Posting Guidelines</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Be specific about the role and responsibilities</li>
                  <li>• Include clear qualification requirements</li>
                  <li>• Set a reasonable deadline for applications</li>
                  <li>• Provide detailed information to attract qualified candidates</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/hr-dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Posting...' : 'Post Internship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
