import React from 'react';

const DashboardChart: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2">Summary</h3>
      <p>Total Applications: 10</p>
      <p>Pending: 5</p>
      <p>Accepted: 3</p>
      {/* Placeholder for chart or more stats */}
    </div>
  );
};

export default DashboardChart;
