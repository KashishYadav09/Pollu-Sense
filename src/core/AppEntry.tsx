import React from 'react';
import { PollutionDashboard } from '../features/dashboard/PollutionDashboard';

export const AppEntry: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#f4f5f8] text-slate-800 antialiased">
      <PollutionDashboard />
    </div>
  );
};

export default AppEntry;
