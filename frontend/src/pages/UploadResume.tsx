import React from 'react'

const UploadResume: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>
      <input type="file" className="mb-4" />
      <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Upload</button>
    </div>
  )
}

export default UploadResume
