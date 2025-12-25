import DashboardLayout from './layout/DashboardLayout';
import DashboardTable from './components/DashboardTable';
import { useState } from 'react';
import ReportDetails from './components/ReportDetails';

import OfficerProfile from './components/OfficerProfile';

function App() {
  const [activeTab, setActiveTab] = useState<'reports' | 'history' | 'profile'>('reports');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Mock Report Details Component (Placeholder until file is created)
  if (selectedReportId) {
    return (
      <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <ReportDetails reportId={selectedReportId} onBack={() => setSelectedReportId(null)} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'profile' ? (
        <OfficerProfile />
      ) : (
        <DashboardTable view={activeTab === 'history' ? 'history' : 'reports'} onViewReport={setSelectedReportId} />
      )}
    </DashboardLayout>
  );
}

export default App;
