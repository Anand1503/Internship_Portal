import React from 'react'
import ResumeUploader from '../components/ResumeUploader'

const UploadResume: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>
      <ResumeUploader />
    </div>
  )
}

export default UploadResume
