import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/apiClient';
import type { DashboardAnalyticsResponse, ResolutionVelocityResponse } from '../../api/types';
import ResolutionVelocity from './ResolutionVelocity';
import { useAuthStore } from '../../stores/authStore';
import { Navigate } from 'react-router-dom';

const Analytics: React.FC = () => {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardAnalyticsResponse | null>(null);
  const [velocityData, setVelocityData] = useState<ResolutionVelocityResponse | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let dashboardQuery = '/analytics/dashboard';
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (params.toString()) dashboardQuery += `?${params.toString()}`;

      const [dashboard, velocity] = await Promise.all([
        apiClient.get<DashboardAnalyticsResponse>(dashboardQuery),
        apiClient.get<ResolutionVelocityResponse>('/analytics/resolution-velocity'),
      ]);

      setDashboardData(dashboard);
      setVelocityData(velocity);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchAnalytics();
    }
  }, [startDate, endDate]);

  if (user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  if (loading && !dashboardData) {
    return <div className="flex justify-center p-12">Loading analytics...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  const hasData = dashboardData && dashboardData.technicianPerformances.length > 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {velocityData && <ResolutionVelocity averageHours={velocityData.averageResolutionTimeHours} />}
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Date Range Filter</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Technician Performance</h3>
        </div>
        <div className="overflow-x-auto">
          {hasData ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved Tickets</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData?.technicianPerformances.map((tech) => (
                  <tr key={tech.technicianId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{tech.technicianName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tech.resolvedTicketsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No resolution data found for the selected period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
