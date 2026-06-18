import { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import RegistrationsTab from '../components/admin/RegistrationsTab';
import EventsTab from '../components/admin/EventsTab';
import './Admin.css';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('inscricoes'); // 'inscricoes' ou 'eventos'

  return (
    <div className="admin-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="admin-main">
        {activeTab === 'inscricoes' && <RegistrationsTab />}
        {activeTab === 'eventos' && <EventsTab />}
      </main>
    </div>
  );
}
