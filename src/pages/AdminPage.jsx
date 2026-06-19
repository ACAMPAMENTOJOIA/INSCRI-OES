import { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import RegistrationsTab from '../components/admin/RegistrationsTab';
import EventsTab from '../components/admin/EventsTab';
import DashboardTab from '../components/admin/DashboardTab';
import FinanceTab from '../components/admin/FinanceTab';
import './Admin.css';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard'); 

  return (
    <div className="admin-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="admin-main">
        {activeTab === 'dashboard' && <DashboardTab setActiveTab={setActiveTab} />}
        {activeTab === 'inscricoes' && <RegistrationsTab />}
        {activeTab === 'eventos' && <EventsTab />}
        {activeTab === 'financeiro' && <FinanceTab />}
      </main>
    </div>
  );
}
