import React from 'react';

interface ResolutionVelocityProps {
  averageHours: number;
}

const ResolutionVelocity: React.FC<ResolutionVelocityProps> = ({ averageHours }) => {
  const formatTime = (hours: number) => {
    if (hours === 0) return 'No data';
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Resolution Time</h3>
      <p className="text-3xl font-bold text-blue-600">{formatTime(averageHours)}</p>
      <p className="text-sm text-gray-500 mt-2">Based on all resolved tickets</p>
    </div>
  );
};

export default ResolutionVelocity;
