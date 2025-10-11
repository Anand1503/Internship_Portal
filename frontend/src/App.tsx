import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SearchInternships from './pages/SearchInternships';
import UploadResume from './pages/UploadResume';
import HRDashboard from './pages/HRDashboard';
import PostJob from './pages/PostJob';
import SortCandidates from './pages/SortCandidates';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <Navbar />
                <main className="p-4">
                  <Dashboard />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr-dashboard"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <Navbar />
                <main className="p-4">
                  <HRDashboard />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/search-internships"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <Navbar />
                <main className="p-4">
                  <SearchInternships />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload-resume"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <Navbar />
                <main className="p-4">
                  <UploadResume />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/post-job"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <Navbar />
                <main className="p-4">
                  <PostJob />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sort-candidates"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <Navbar />
                <main className="p-4">
                  <SortCandidates />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
