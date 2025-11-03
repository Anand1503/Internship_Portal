import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { Upload, FileText, Trash2, Download, AlertCircle, X } from 'lucide-react';

interface Resume {
  id: number;
  title: string;
  file_path: string;
  created_at: string;
}

const UploadResume: React.FC = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.resumes.getMyResumes();
      setResumes(response.data);
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
        <p className="text-dim-300">Upload and manage your resumes for internship applications</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-200 hover:shadow-medium transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload New Resume</h2>
        
        {uploadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{uploadError}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Software Engineering Resume"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all duration-200"
              >
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium mb-1">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    PDF files only (MAX. 10MB)
                  </p>
                </div>
              </label>
            </div>
            
            {file && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
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
      <div className="bg-white rounded-xl shadow-soft border border-gray-200 hover:shadow-medium transition-all duration-300">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">My Resumes</h2>
        </div>
        
        <div className="p-6">
          {resumesLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : resumes.length > 0 ? (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div key={resume.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white rounded-lg">
                      <FileText className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{resume.title}</h3>
                      <p className="text-sm text-gray-500">
                        Uploaded on {new Date(resume.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownload(resume.id, resume.title)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      disabled={deleteLoading === resume.id}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
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
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-2">No resumes uploaded yet</p>
              <p className="text-gray-500 text-sm">Upload your first resume to start applying for internships</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
