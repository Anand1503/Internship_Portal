import React, { useState, useEffect } from 'react'
import apiClient from '../api/client'

interface Internship {
  id: number
  title: string
  company: string
  location: string
  description: string
}

interface Resume {
  id: number
  title: string
}

const SearchInternships: React.FC = () => {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | ''>('')
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchInternships()
  }, [])

  const fetchInternships = async () => {
    try {
      const response = await apiClient.get('/internships')
      setInternships(response.data)
    } catch (err: any) {
      setError('Failed to load internships')
    } finally {
      setLoading(false)
    }
  }

  const fetchResumes = async () => {
    try {
      const response = await apiClient.get('/resumes/me')
      setResumes(response.data)
    } catch (err: any) {
      setMessage('Failed to load resumes')
    }
  }

  const handleApply = (internship: Internship) => {
    setSelectedInternship(internship)
    setModalOpen(true)
    setMessage('')
    fetchResumes()
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedResumeId) {
      setMessage('Please select a resume')
      return
    }
    setApplying(true)
    try {
      await apiClient.post('/applications', {
        internship_id: selectedInternship!.id,
        resume_id: selectedResumeId,
        cover_letter: coverLetter,
      })
      setMessage('Application submitted successfully!')
      setModalOpen(false)
      setSelectedResumeId('')
      setCoverLetter('')
    } catch (err: any) {
      setMessage('Failed to submit application: ' + (err.response?.data?.detail || err.message))
    } finally {
      setApplying(false)
    }
  }

  const filteredInternships = internships.filter(internship =>
    internship.title.toLowerCase().includes(search.toLowerCase()) &&
    (role ? internship.title.toLowerCase().includes(role.toLowerCase()) : true) &&
    (company ? internship.company.toLowerCase().includes(company.toLowerCase()) : true) &&
    (location ? internship.location.toLowerCase().includes(location.toLowerCase()) : true)
  )

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Internships</h1>
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInternships.map(internship => (
          <div key={internship.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{internship.title}</h2>
            <p>Company: {internship.company}</p>
            <p>Location: {internship.location}</p>
            <p>{internship.description}</p>
            <button
              onClick={() => handleApply(internship)}
              className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Apply for {selectedInternship?.title}</h2>
            <form onSubmit={handleSubmitApplication}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Choose a resume</option>
                  {resumes.map(resume => (
                    <option key={resume.id} value={resume.id}>{resume.title}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Cover Letter (optional)</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={applying}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
            {message && (
              <p className={`mt-4 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchInternships
