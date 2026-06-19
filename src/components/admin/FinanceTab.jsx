import { useState, useEffect } from 'react';
import { Search, Edit3 } from 'lucide-react';
import { fetchAllRegistrations } from '../../services/admin.service';
import PaymentModal from './PaymentModal';

export default function FinanceTab() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);

  const loadData = async () => {
    const data = await fetchAllRegistrations();
    setRegistrations(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handlePaymentSuccess = (newStatus, newVal) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === selectedReg.id ? { ...reg, status_pagamento: newStatus, valor_pago: newVal } : reg
    ));
    setSelectedReg(null);
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span className={`status-badge status-${(reg.status_pagamento || 'Pendente').toLowerCase()}`} style={{ width: 'fit-content' }}>
                          {reg.status_pagamento || 'Pendente'}
                        </span>
                        <small style={{ color: '#666', fontWeight: 'bold' }}>
                          {formatCurrency(reg.valor_pago || 0)} / {formatCurrency(reg.events?.price || 0)}
                        </small>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="btn-small" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#3b82f6' }}
                        onClick={() => setSelectedReg(reg)}
                      >
                        <Edit3 size={16} /> Atualizar Pagamento
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
      
      {selectedReg && (
        <PaymentModal 
          selectedReg={selectedReg} 
          onClose={() => setSelectedReg(null)} 
          onSuccess={handlePaymentSuccess} 
        />
      )}
    </>
  );
}
