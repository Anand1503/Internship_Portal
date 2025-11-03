import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Building2, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerRole, setRegisterRole] = useState<'student' | 'hr'>('student');
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { success, error: showError } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.auth.login(loginEmail, loginPassword);
      const data = response.data;
      
      await authLogin(data.access_token, data.user);
      success('Login successful!');
      
      // Redirect based on role
      if (data.user.role === 'hr') {
        navigate('/hr-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.auth.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role: registerRole
      });
      
      success('Registration successful! Please login with your credentials.');
      
      // Switch to login tab and clear register form
      setActiveTab('login');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterRole('student');
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-jet-900 to-rose-900 flex items-center justify-center p-4">
      <div className="bg-jet-900 rounded-2xl shadow-medium p-8 w-full max-w-md border border-dim-700">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-900 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-rose-300" />
          </div>
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-rose-400 to-rose-300 bg-clip-text text-transparent mb-2">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-dim-300">
            {activeTab === 'login' ? 'Sign in to your account' : 'Join our platform today'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 bg-night-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'login'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-dim-300 hover:text-light-100'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'register'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-dim-300 hover:text-light-100'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dim-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 border border-dim-600 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all duration-200 bg-night-800 text-light-100 placeholder-dim-400 focus:bg-night-700"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dim-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-dim-600 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all duration-200 bg-night-800 text-light-100 placeholder-dim-400 focus:bg-night-700"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dim-400 hover:text-dim-200 transition-colors"
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 px-4 rounded-xl font-medium hover:from-rose-600 hover:to-rose-700 focus:ring-4 focus:ring-rose-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dim-200 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="w-full px-4 py-3 border border-dim-600 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all duration-200 bg-night-800 text-light-100 placeholder-dim-400 focus:bg-night-700"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dim-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full px-4 py-3 border border-dim-600 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all duration-200 bg-night-800 text-light-100 placeholder-dim-400 focus:bg-night-700"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dim-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-dim-600 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all duration-200 bg-night-800 text-light-100 placeholder-dim-400 focus:bg-night-700"
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dim-400 hover:text-dim-200 transition-colors"
                >
                  {showRegisterPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-dim-400">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dim-200 mb-2">
                Account Type
              </label>
              <select
                value={registerRole}
                onChange={(e) => setRegisterRole(e.target.value as 'student' | 'hr')}
                className="w-full px-4 py-3 border border-dim-600 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all duration-200 bg-night-800 text-light-100 placeholder-dim-400 focus:bg-night-700"
                required
              >
                <option value="student">Student - Looking for internships</option>
                <option value="hr">HR Manager - Posting internships</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 px-4 rounded-xl font-medium hover:from-rose-600 hover:to-rose-700 focus:ring-4 focus:ring-rose-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-dim-300">
            {activeTab === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setActiveTab('register')}
                  className="text-rose-400 hover:text-rose-300 font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-rose-400 hover:text-rose-300 font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
