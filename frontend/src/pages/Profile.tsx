import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { User, Mail, Briefcase, Calendar, Edit2, Save, X } from 'lucide-react';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const Profile: React.FC = () => {
  const { success, error: showError } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.auth.getMe();
      setProfile(response.data);
      setEditedName(response.data.name);
    } catch (err: any) {
      showError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Call the backend API to update the profile
      const response = await api.auth.updateProfile({ name: editedName });
      setProfile(response.data);
      success('Profile updated successfully!');
      setEditing(false);
    } catch (err: any) {
      showError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedName(profile?.name || '');
    setEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'hr' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 font-medium">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">View and manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        {/* Header with Avatar */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-12">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-primary-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{profile.name}</h2>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(profile.role)}`}>
                  {profile.role === 'hr' ? 'HR Manager' : 'Student'}
                </span>
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-8 space-y-6">
          {/* Name */}
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-lg text-gray-900">{profile.name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Email Address</label>
              <p className="text-lg text-gray-900">{profile.email}</p>
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Account Type</label>
              <p className="text-lg text-gray-900 capitalize">{profile.role === 'hr' ? 'HR Manager' : 'Student'}</p>
              <p className="text-sm text-gray-500 mt-1">
                {profile.role === 'hr' 
                  ? 'You can post jobs and manage applications' 
                  : 'You can search and apply for internships'}
              </p>
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Member Since</label>
              <p className="text-lg text-gray-900">{formatDate(profile.created_at)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Card (Role-specific) */}
      {profile.role === 'student' && (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">-</p>
              <p className="text-sm text-gray-600 mt-1">Applications</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">-</p>
              <p className="text-sm text-gray-600 mt-1">Resumes</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">-</p>
              <p className="text-sm text-gray-600 mt-1">Pending</p>
            </div>
          </div>
        </div>
      )}

      {profile.role === 'hr' && (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">-</p>
              <p className="text-sm text-gray-600 mt-1">Jobs Posted</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">-</p>
              <p className="text-sm text-gray-600 mt-1">Total Applicants</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">-</p>
              <p className="text-sm text-gray-600 mt-1">Active Jobs</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
