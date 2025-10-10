import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import apiClient from '../api/client'

interface Application {
  id: number
  internship: {
    id: number
    title: string
    company: string
  }
  status: string
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await apiClient.get('/applications/me')
      setApplications(response.data)
    } catch (err: any) {
      setError('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const uniqueCompanies = new Set(applications.map(app => app.internship.company)).size

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || user?.email}!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Summary</h2>
          <p className="text-2xl font-bold text-blue-600">Unique companies: {uniqueCompanies}</p>
          <p className="text-gray-600">Total applications: {applications.length}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">My Applications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">No applications yet. Start searching for internships!</td>
                </tr>
              ) : (
                applications.map((app, index) => (
                  <tr key={app.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.internship.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.internship.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
