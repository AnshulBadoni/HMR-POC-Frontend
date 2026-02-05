import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import { PageLoader } from '../components/ui/Spinner';
import { dashboardAPI } from '../services/api';

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 ${colors[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getStats();
        setStats(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="ml-64 min-h-screen">
        <Header title="Dashboard" subtitle="Welcome back! Here's your overview." />
        <main className="p-8">
          <PageLoader />
        </main>
      </div>
    );
  }

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <Header title="Dashboard" subtitle="Welcome back! Here's your overview." />
      
      <main className="p-8">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Employees"
                value={stats?.total_employees || 0}
                icon={Users}
                color="blue"
              />
              <StatCard
                title="Present Today"
                value={stats?.present_today || 0}
                icon={UserCheck}
                color="green"
              />
              <StatCard
                title="Absent Today"
                value={stats?.absent_today || 0}
                icon={UserX}
                color="red"
              />
              <StatCard
                title="Not Marked"
                value={stats?.not_marked || 0}
                icon={Clock}
                color="yellow"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a
                    href="/employees"
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Users className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-gray-900">Manage Employees</span>
                  </a>
                  <a
                    href="/attendance"
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <UserCheck className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-gray-900">Mark Attendance</span>
                  </a>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Attendance Rate</span>
                    <span className="font-semibold text-gray-900">
                      {stats?.total_employees > 0
                        ? Math.round((stats?.present_today / stats?.total_employees) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          stats?.total_employees > 0
                            ? (stats?.present_today / stats?.total_employees) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {stats?.present_today} of {stats?.total_employees} employees marked present
                  </p>
                </div>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
