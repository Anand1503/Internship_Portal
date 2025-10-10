import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';

const UploadResume: React.FC = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file || !title) return;
    // Post to /resumes
    // import { uploadResume } from '../api/resumes';
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('title', title);
    // uploadResume(formData);
    console.log('Uploading resume');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full max-w-md"
        />
      </div>
      <FileUploader onFileSelect={setFile} />
      <button onClick={handleUpload} className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Upload
      </button>
    </div>
  );
};

export default UploadResume;
