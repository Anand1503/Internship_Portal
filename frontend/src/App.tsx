import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SearchInternships from './pages/SearchInternships';
import UploadResume from './pages/UploadResume';
import Profile from './pages/Profile';
import HRDashboard from './pages/HRDashboard';
import PostJob from './pages/PostJob';
import SortCandidates from './pages/SortCandidates';
import ResumeAnalysisPage from './pages/ResumeAnalysisPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout>
                  <SearchInternships />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-internships"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout>
                  <SearchInternships />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-resume"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout>
                  <UploadResume />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['student', 'hr']}>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resumes/analysis/:analysisId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout>
                  <ResumeAnalysisPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr-dashboard"
            element={
              <ProtectedRoute allowedRoles={['hr']}>
                <Layout>
                  <HRDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute allowedRoles={['hr']}>
                <Layout>
                  <PostJob />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sort-candidates"
            element={
              <ProtectedRoute allowedRoles={['hr']}>
                <Layout>
                  <SortCandidates />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
