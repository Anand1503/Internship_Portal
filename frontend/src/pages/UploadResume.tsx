import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { uploadResume } from '../api/resumes';

const UploadResume: React.FC = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpload = async () => {
    if (!file || !title) {
      setError('Please provide title and select a file');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      await uploadResume(formData);
      setSuccess('Resume uploaded successfully');
      setTitle('');
      setFile(null);
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d: any) => d.msg).join(', ') || 'Upload failed');
      } else {
        setError(detail || 'Upload failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full max-w-md"
          required
        />
      </div>
      <FileUploader onFileSelect={setFile} />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default UploadResume;
