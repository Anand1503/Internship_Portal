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

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p>Unique companies applied to: {uniqueCompanies}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">My Applications</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Company</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td className="border border-gray-300 p-2">{app.internship.company}</td>
                <td className="border border-gray-300 p-2">{app.internship.title}</td>
                <td className="border border-gray-300 p-2">{app.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentDashboard
