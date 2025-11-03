import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { Briefcase, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Application {
  id: number;
  internship_title: string;
  company_name: string;
  status: string;
  applied_at: string;
}

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.applications.getMyApplications();
        setApplications(response.data);
      } catch (err: any) {
        setError('Failed to fetch applications');
        showError('Failed to load applications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [showError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-dim-300">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-900 border border-rose-700 rounded-xl p-6 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-rose-300 font-medium">{error}</p>
      </div>
    );
  }

  // Calculate statistics
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const acceptedApplications = applications.filter(app => app.status === 'accepted').length;
  const rejectedApplications = applications.filter(app => app.status === 'rejected').length;

  // Prepare chart data
  const statusData: ChartData[] = [
    { name: 'Pending', value: pendingApplications },
    { name: 'Accepted', value: acceptedApplications },
    { name: 'Rejected', value: rejectedApplications },
  ];

  const companyData = applications.reduce((acc: any, app) => {
    const existing = acc.find((item: any) => item.name === app.company_name);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: app.company_name, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = {
    primary: '#bcabae', // rose quartz
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    gray: '#716969' // dim gray
  };

  const statusColors = {
    'Pending': COLORS.warning,
    'Accepted': COLORS.success,
    'Rejected': COLORS.danger,
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'accepted': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'rejected': 'bg-red-100 text-red-800',
    };
    return colors[status.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-rose-300 bg-clip-text text-transparent mb-2">Student Dashboard</h1>
        <p className="text-dim-300">Track your internship applications and their status</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-jet-900 rounded-xl shadow-soft p-6 border border-dim-700 hover:shadow-medium transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dim-400">Total Applications</p>
              <p className="text-2xl font-bold text-light-100 mt-1">{totalApplications}</p>
            </div>
            <div className="p-3 bg-rose-900 rounded-lg">
              <Briefcase className="w-6 h-6 text-rose-400" />
            </div>
          </div>
        </div>

        <div className="bg-jet-900 rounded-xl shadow-soft p-6 border border-dim-700 hover:shadow-medium transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dim-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{pendingApplications}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-jet-900 rounded-xl shadow-soft p-6 border border-dim-700 hover:shadow-medium transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dim-400">Accepted</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{acceptedApplications}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-jet-900 rounded-xl shadow-soft p-6 border border-dim-700 hover:shadow-medium transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dim-400">Rejected</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{rejectedApplications}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Chart */}
        <div className="bg-jet-900 rounded-xl shadow-soft p-6 border border-dim-700 hover:shadow-medium transition-all duration-300">
          <h3 className="text-lg font-semibold text-light-100 mb-4">Application Status</h3>
          {totalApplications > 0 ? (
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[entry.name as keyof typeof statusColors]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-dim-400">
              No applications yet
            </div>
          )}
        </div>

        {/* Applications by Company Chart */}
        <div className="bg-jet-900 rounded-xl shadow-soft p-6 border border-dim-700 hover:shadow-medium transition-all duration-300">
          <h3 className="text-lg font-semibold text-light-100 mb-4">Applications by Company</h3>
          {companyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={companyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-dim-400">
              No applications yet
            </div>
          )}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-jet-900 rounded-xl shadow-soft border border-dim-700 hover:shadow-medium transition-all duration-300">
        <div className="p-6 border-b border-dim-700">
          <h3 className="text-lg font-semibold text-light-100">My Applications</h3>
        </div>
        <div className="overflow-x-auto">
          {applications.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-night-800">
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-dim-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-dim-400 uppercase tracking-wider">
                    Role Applied
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-dim-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-dim-400 uppercase tracking-wider">
                    Applied Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-jet-900 divide-y divide-dim-700">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-night-800 transition-colors">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-light-100">
                      {app.company_name}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-light-100">
                      {app.internship_title}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(app.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-dim-300">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-dim-400" />
                        <span>{new Date(app.applied_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-dim-400 mx-auto mb-4" />
              <p className="text-dim-300 font-medium">No applications yet</p>
              <p className="text-dim-400 text-sm mt-2">Start applying to internships to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
