import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import apiClient from '../api/client'

interface Application {
  id: number
  candidate_name: string
  role: string
  resume_url: string
  status: string
}

const HRDashboard: React.FC = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.id) {
      fetchApplications()
    }
  }, [user])

  const fetchApplications = async () => {
    try {
      const response = await apiClient.get(`/hr/my_jobs/${user.id}/applications`)
      setApplications(response.data)
    } catch (err: any) {
      setError('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">HR Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p>Total applications: {applications.length}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Applications</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Candidate Name</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Resume</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td className="border border-gray-300 p-2">{app.candidate_name}</td>
                <td className="border border-gray-300 p-2">{app.role}</td>
                <td className="border border-gray-300 p-2"><a href={app.resume_url} target="_blank" rel="noopener noreferrer">View Resume</a></td>
                <td className="border border-gray-300 p-2">{app.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HRDashboard
