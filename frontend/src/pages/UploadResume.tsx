import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { Upload, FileText, Trash2, Download, AlertCircle, X, Sparkles, Eye } from 'lucide-react';
import { startResumeAnalysis, listAnalysesForResume, type ResumeAnalysisListItem } from '../api/resumeAnalysis';
import ResumeScoreBadge from '../components/ResumeScoreBadge';
import AnalysisStatusBadge from '../components/AnalysisStatusBadge';

interface Resume {
  id: number;
  title: string;
  file_path: string;
  created_at: string;
}

interface ResumeWithAnalysis extends Resume {
  latestAnalysis?: ResumeAnalysisListItem;
  analyzing?: boolean;
}

const UploadResume: React.FC = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [resumes, setResumes] = useState<ResumeWithAnalysis[]>([]);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.resumes.getMyResumes();
      const resumesData: Resume[] = response.data;

      // Fetch latest analyses for each resume
      const resumesWithAnalyses = await Promise.all(
        resumesData.map(async (resume) => {
          try {
            const analyses = await listAnalysesForResume(resume.id);
            return {
              ...resume,
              latestAnalysis: analyses && analyses.length > 0 ? analyses[0] : undefined,
              analyzing: false
            };
          } catch {
            return { ...resume, analyzing: false };
          }
        })
      );

      setResumes(resumesWithAnalyses);
    } catch (error: any) {
      showError('Failed to fetch resumes');
    } finally {
      setResumesLoading(false);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setUploadError('');
    } else {
      setUploadError('Please select a PDF file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      setUploadError('Please provide title and select a PDF file');
      return;
    }
    setLoading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      await api.resumes.upload(formData);
      success('Resume uploaded successfully!');
      setTitle('');
      setFile(null);
      fetchResumes(); // Refresh the list
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Upload failed';
      setUploadError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (resumeId: number) => {
    // Set analyzing state for this resume
    setResumes(prev => prev.map(r =>
      r.id === resumeId ? { ...r, analyzing: true } : r
    ));

    try {
      const analysis = await startResumeAnalysis(resumeId);
      success('Resume analysis started!');

      // Update resume with new analysis
      setResumes(prev => prev.map(r =>
        r.id === resumeId ? { ...r, latestAnalysis: analysis as unknown as ResumeAnalysisListItem, analyzing: false } : r
      ));

      // Navigate to analysis page
      navigate(`/resumes/analysis/${analysis.id}`);
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Failed to start analysis');
      setResumes(prev => prev.map(r =>
        r.id === resumeId ? { ...r, analyzing: false } : r
      ));
    }
  };

  const handleDelete = async (resumeId: number) => {
    setDeleteLoading(resumeId);
    try {
      await api.resumes.delete(resumeId);
      success('Resume deleted successfully');
      fetchResumes(); // Refresh the list
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Delete failed';
      showError(errorMessage);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDownload = async (resumeId: number, resumeTitle: string) => {
    try {
      const response = await api.resumes.download(resumeId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      showError('Failed to download resume');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-rose-300 bg-clip-text text-transparent mb-2">Resume Management</h1>
        <p className="text-gray-600 dark:text-dim-300">Upload and manage your resumes for internship applications</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white dark:bg-jet-900 rounded-xl shadow-soft p-6 border border-gray-200 dark:border-dim-700 hover:shadow-medium transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-light-100 mb-6">Upload New Resume</h2>

        {uploadError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 dark:text-red-400">{uploadError}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dim-300 mb-2">
              Resume Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Software Engineering Resume"
              className="w-full px-4 py-3 border border-gray-300 dark:border-dim-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-night-800 text-gray-900 dark:text-light-100"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dim-300 mb-2">
              Select PDF File
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-dim-600 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-night-800 transition-all duration-200"
              >
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 dark:text-dim-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-dim-300 font-medium mb-1">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    PDF files only (MAX. 10MB)
                  </p>
                </div>
              </label>
            </div>

            {file && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-night-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 dark:text-dim-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-light-100">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-dim-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-night-700 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-dim-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={loading || !file || !title}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </div>
      </div>

      {/* Existing Resumes */}
      <div className="bg-white dark:bg-jet-900 rounded-xl shadow-soft border border-gray-200 dark:border-dim-700 hover:shadow-medium transition-all duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-dim-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-light-100">My Resumes</h2>
        </div>

        <div className="p-6">
          {resumesLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : resumes.length > 0 ? (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div key={resume.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-night-800 rounded-lg hover:bg-gray-100 dark:hover:bg-night-700 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-3 bg-white dark:bg-jet-900 rounded-lg">
                      <FileText className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-light-100">{resume.title}</h3>
                        {resume.latestAnalysis && resume.latestAnalysis.score !== null && (
                          <ResumeScoreBadge score={resume.latestAnalysis.score} size="sm" />
                        )}
                        {resume.latestAnalysis && (
                          <AnalysisStatusBadge status={resume.latestAnalysis.status as any} />
                        )}
                      </div>
                      <p className="text-sm text-gray-400 dark:text-dim-400">
                        Uploaded on {new Date(resume.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAnalyze(resume.id)}
                      disabled={resume.analyzing || (resume.latestAnalysis?.status === 'pending')}
                      className="flex items-center gap-1.5 px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Analyze with AI"
                    >
                      <Sparkles className={`w-4 h-4 ${resume.analyzing ? 'animate-pulse' : ''}`} />
                      <span className="text-sm font-medium">
                        {resume.analyzing ? 'Starting...' : resume.latestAnalysis ? 'Re-analyze' : 'Analyze'}
                      </span>
                    </button>

                    {resume.latestAnalysis && (
                      <button
                        onClick={() => navigate(`/resumes/analysis/${resume.latestAnalysis!.id}`)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        title="View Analysis"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDownload(resume.id, resume.title)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      disabled={deleteLoading === resume.id}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Delete"
                    >
                      {deleteLoading === resume.id ? (
                        <div className="w-5 h-5 animate-spin rounded-full border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 dark:text-dim-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-dim-300 font-medium mb-2">No resumes uploaded yet</p>
              <p className="text-gray-500 dark:text-dim-400 text-sm">Upload your first resume to start applying for internships</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
