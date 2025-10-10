import React from 'react'

const PostJob: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Post Job</h1>
      <form>
        <input type="text" placeholder="Job Title" className="p-2 border border-gray-300 rounded w-full mb-4" />
        <textarea placeholder="Description" className="p-2 border border-gray-300 rounded w-full mb-4"></textarea>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Post Job</button>
      </form>
    </div>
  )
}

export default PostJob
