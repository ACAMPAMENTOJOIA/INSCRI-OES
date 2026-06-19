import { LogOut, Users, Calendar, LayoutDashboard, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <img src="/assets/logo-branco.png" alt="Logo" className="sidebar-logo" />
        <h3>Painel Admin</h3>
      </div>
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Visão Geral</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'inscricoes' ? 'active' : ''}`}
          onClick={() => setActiveTab('inscricoes')}
        >
          <Users size={20} />
          <span>Inscrições</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'eventos' ? 'active' : ''}`}
          onClick={() => setActiveTab('eventos')}
        >
          <Calendar size={20} />
          <span>Eventos</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'financeiro' ? 'active' : ''}`}
          onClick={() => setActiveTab('financeiro')}
        >
          <DollarSign size={20} />
          <span>Financeiro</span>
        </button>
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </nav>
    </aside>
  );
}
