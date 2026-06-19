import { useState, useEffect } from 'react';
import { Search, Save } from 'lucide-react';
import { fetchAllRegistrations, updateCampData } from '../../services/admin.service';
import PaymentModal from './PaymentModal';

export default function FinanceTab() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);
  const [savingId, setSavingId] = useState(null);

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

  const handleFieldChange = (id, field, value) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === id ? { ...reg, [field]: value, _isDirty: true } : reg
    ));
  };

  const saveRowData = async (reg) => {
    if (!reg._isDirty) return;
    setSavingId(reg.id);
    try {
      await updateCampData(reg.id, {
        equipe: reg.equipe,
        quarto: reg.quarto,
        conselheiro: reg.conselheiro
      });
      setRegistrations(prev => prev.map(r => r.id === reg.id ? { ...r, _isDirty: false } : r));
    } catch (err) {
      alert('Erro ao salvar dados.');
    } finally {
      setSavingId(null);
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRowClass = (status) => {
    if (status === 'Pago') return 'row-paid';
    if (status === 'Parcial') return 'row-partial';
    return '';
  };

  return (
    <>
      <header className="admin-header">
        <h2>Planilha Financeira e Acomodação</h2>
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
      
      <div className="admin-content" style={{ padding: '1rem' }}>
        {loading ? (
          <div className="loading-state">Carregando planilha...</div>
        ) : (
          <div className="spreadsheet-container">
            <table className="spreadsheet-table">
              <thead>
                <tr>
                  <th style={{ minWidth: '200px' }}>Nome Completo</th>
                  <th>Evento</th>
                  <th>Igreja</th>
                  <th>Idade</th>
                  <th>PG (R$)</th>
                  <th>Status</th>
                  <th>Ações Pgto</th>
                  <th>Equipe / Time</th>
                  <th>Quarto</th>
                  <th>Conselheiro(a)</th>
                  <th>Salvar</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className={getRowClass(reg.status_pagamento)}>
                    <td style={{ fontWeight: 'bold' }}>{reg.nome_completo}</td>
                    <td>{reg.events?.title || '-'}</td>
                    <td>{reg.igreja || '-'}</td>
                    <td style={{ textAlign: 'center' }}>{reg.idade}</td>
                    <td style={{ fontWeight: 'bold', textAlign: 'right' }}>
                      {reg.valor_pago ? parseFloat(reg.valor_pago).toFixed(2) : '0.00'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {reg.status_pagamento || 'Pendente'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn-small" 
                        style={{ padding: '0.2rem 0.5rem', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'inherit' }}
                        onClick={() => setSelectedReg(reg)}
                      >
                        $$$
                      </button>
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="spreadsheet-input"
                        value={reg.equipe || ''}
                        onChange={(e) => handleFieldChange(reg.id, 'equipe', e.target.value)}
                        placeholder="Ex: Amarelo"
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="spreadsheet-input"
                        value={reg.quarto || ''}
                        onChange={(e) => handleFieldChange(reg.id, 'quarto', e.target.value)}
                        placeholder="Ex: Quarto 1"
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="spreadsheet-input"
                        value={reg.conselheiro || ''}
                        onChange={(e) => handleFieldChange(reg.id, 'conselheiro', e.target.value)}
                        placeholder="Ex: Debora"
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {reg._isDirty ? (
                        <button 
                          className="btn-small" 
                          style={{ padding: '0.2rem', backgroundColor: '#3b82f6' }}
                          onClick={() => saveRowData(reg)}
                          disabled={savingId === reg.id}
                        >
                          <Save size={16} />
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td colSpan="11" className="text-center py-4" style={{ backgroundColor: 'white', color: '#666' }}>
                      Nenhuma inscrição encontrada.
                    </td>
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
