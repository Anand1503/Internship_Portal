import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'

const Login = lazy(() => import('./pages/Login'))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'))
const SearchInternships = lazy(() => import('./pages/SearchInternships'))
const UploadResume = lazy(() => import('./pages/UploadResume'))
const PostJob = lazy(() => import('./pages/PostJob'))
const SortCandidates = lazy(() => import('./pages/SortCandidates'))

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/search" element={<SearchInternships />} />
            <Route path="/upload-resume" element={<UploadResume />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/sort-candidates" element={<SortCandidates />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App
