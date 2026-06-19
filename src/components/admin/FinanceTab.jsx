import { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock } from 'lucide-react';
import { fetchAllRegistrations, updatePaymentStatus } from '../../services/admin.service';

export default function FinanceTab() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    const data = await fetchAllRegistrations();
    setRegistrations(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePayment = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pago' ? 'Pendente' : 'Pago';
    const success = await updatePaymentStatus(id, newStatus);
    if (success) {
      setRegistrations(prev => prev.map(reg => 
        reg.id === id ? { ...reg, status_pagamento: newStatus } : reg
      ));
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="admin-header">
        <h2>Módulo Financeiro</h2>
        <div className="search-bar">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      
      <div className="admin-content">
        {loading ? (
          <div className="loading-state">Carregando dados financeiros...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Inscrito</th>
                  <th>Evento</th>
                  <th>Status de Pagamento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>
                      <strong>{reg.nome_completo}</strong><br/>
                      <small style={{ color: '#666' }}>{reg.telefone}</small>
                    </td>
                    <td>{reg.events?.title || '-'}</td>
                    <td>
                      <span className={`status-badge status-${(reg.status_pagamento || 'Pendente').toLowerCase()}`}>
                        {reg.status_pagamento || 'Pendente'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-small" 
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          backgroundColor: reg.status_pagamento === 'Pago' ? '#f59e0b' : '#10b981'
                        }}
                        onClick={() => handleTogglePayment(reg.id, reg.status_pagamento || 'Pendente')}
                      >
                        {reg.status_pagamento === 'Pago' ? (
                          <><Clock size={16} /> Marcar Pendente</>
                        ) : (
                          <><CheckCircle size={16} /> Dar Baixa (Pago)</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Nenhuma inscrição encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
