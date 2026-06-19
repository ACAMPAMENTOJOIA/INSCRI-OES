import { useState, useEffect } from 'react';
import { Users, Calendar as CalendarIcon, DollarSign, Activity } from 'lucide-react';
import { fetchAllRegistrations, fetchAllEvents } from '../../services/admin.service';

export default function DashboardTab({ setActiveTab }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRegs: 0,
    activeEvents: 0,
    expectedRevenue: 0,
    collectedRevenue: 0
  });

  useEffect(() => {
    const loadData = async () => {
      const [regsData, eventsData] = await Promise.all([
        fetchAllRegistrations(),
        fetchAllEvents()
      ]);

      const activeEventsCount = eventsData.filter(e => e.active).length;
      
      let expected = 0;
      let collected = 0;

      const campRegistrations = regsData.filter(reg => !reg.is_cantina_only);

      campRegistrations.forEach(reg => {
        const eventInfo = eventsData.find(e => e.id === reg.event_id);
        const price = eventInfo?.price ? parseFloat(eventInfo.price) : 0;
        
        expected += price;
        collected += reg.valor_pago ? parseFloat(reg.valor_pago) : 0;
      });

      setStats({
        totalRegs: campRegistrations.length,
        activeEvents: eventsData.filter(e => e.active).length,
        expectedRevenue: expected,
        collectedRevenue: collected
      });
      setLoading(false);
    };

    loadData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (loading) {
    return <div className="admin-content"><div className="loading-state">Carregando painel...</div></div>;
  }

  return (
    <>
      <header className="admin-header">
        <h2>Visão Geral do Sistema</h2>
      </header>
      
      <div className="admin-content">
        <div className="dashboard-grid">
          <div className="dash-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>Total de Inscritos</h4>
              <Users size={20} color="var(--accent-color)" />
            </div>
            <p className="value">{stats.totalRegs}</p>
            <button className="btn-small" style={{ marginTop: 'auto', alignSelf: 'flex-start' }} onClick={() => setActiveTab('inscricoes')}>
              Ver Lista Completa
            </button>
          </div>

          <div className="dash-card" style={{ borderTopColor: '#3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>Eventos Ativos</h4>
              <CalendarIcon size={20} color="#3b82f6" />
            </div>
            <p className="value">{stats.activeEvents}</p>
            <button className="btn-small" style={{ marginTop: 'auto', alignSelf: 'flex-start', backgroundColor: '#3b82f6' }} onClick={() => setActiveTab('eventos')}>
              Gerenciar Eventos
            </button>
          </div>

          <div className="dash-card" style={{ borderTopColor: '#eab308' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>Receita Prevista</h4>
              <Activity size={20} color="#eab308" />
            </div>
            <p className="value">{formatCurrency(stats.expectedRevenue)}</p>
            <small style={{ color: '#6b7280', marginTop: 'auto' }}>Se todos os inscritos pagarem</small>
          </div>

          <div className="dash-card" style={{ borderTopColor: '#22c55e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>Receita Arrecadada</h4>
              <DollarSign size={20} color="#22c55e" />
            </div>
            <p className="value" style={{ color: '#16a34a' }}>{formatCurrency(stats.collectedRevenue)}</p>
            <button className="btn-small" style={{ marginTop: 'auto', alignSelf: 'flex-start', backgroundColor: '#22c55e' }} onClick={() => setActiveTab('financeiro')}>
              Dar baixa em Pagamentos
            </button>
          </div>
        </div>

        <div className="table-container" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Bem-vindo ao Acampamento Jóia OS</h3>
          <p style={{ color: '#666', maxWidth: '600px', margin: '1rem auto' }}>
            Utilize o menu lateral para gerenciar os participantes dos seus próximos eventos, 
            criar novos retiros e manter o controle financeiro de tudo que está acontecendo.
          </p>
        </div>
      </div>
    </>
  );
}
