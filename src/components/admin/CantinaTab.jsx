import { useState, useEffect } from 'react';
import { Search, Plus, Minus, UserPlus } from 'lucide-react';
import { fetchAllRegistrations, updateCantinaBalance, addCantinaGuest } from '../../services/admin.service';

export default function CantinaTab() {
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

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleDeposit = async (reg) => {
    const amount = parseFloat(window.prompt(`Quanto deseja depositar para ${reg.nome_completo}?`, "10.00"));
    if (isNaN(amount) || amount <= 0) return;

    const currentBalance = reg.saldo_cantina ? parseFloat(reg.saldo_cantina) : 0;
    const newBalance = currentBalance + amount;

    try {
      await updateCantinaBalance(reg.id, newBalance);
      setRegistrations(prev => prev.map(r => r.id === reg.id ? { ...r, saldo_cantina: newBalance } : r));
    } catch (err) {
      alert('Erro ao atualizar saldo.');
    }
  };

  const handlePurchase = async (reg) => {
    const amount = parseFloat(window.prompt(`Qual o valor da compra de ${reg.nome_completo}?`, "5.00"));
    if (isNaN(amount) || amount <= 0) return;

    const currentBalance = reg.saldo_cantina ? parseFloat(reg.saldo_cantina) : 0;
    
    if (amount > currentBalance) {
      if (!window.confirm(`Atenção: O saldo atual é apenas ${formatCurrency(currentBalance)}. Deseja deixar o saldo negativo?`)) {
        return;
      }
    }

    const newBalance = currentBalance - amount;

    try {
      await updateCantinaBalance(reg.id, newBalance);
      setRegistrations(prev => prev.map(r => r.id === reg.id ? { ...r, saldo_cantina: newBalance } : r));
    } catch (err) {
      alert('Erro ao atualizar saldo.');
    }
  };

  const handleAddGuest = async () => {
    const nome = window.prompt("Digite o nome completo do cliente avulso:");
    if (!nome || nome.trim() === '') return;

    try {
      const newGuest = await addCantinaGuest(nome);
      if (newGuest) {
        setRegistrations(prev => [newGuest, ...prev]);
      }
    } catch (err) {
      alert('Erro ao adicionar cliente. Verifique sua conexão.');
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="admin-header">
        <h2>Módulo Cantina (Saldo Virtual)</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            className="btn btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#10b981', border: 'none' }}
            onClick={handleAddGuest}
          >
            <UserPlus size={18} /> Novo Cliente Manual
          </button>
          <div className="search-bar" style={{ margin: 0 }}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar campista..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>
      
      <div className="admin-content" style={{ padding: '1rem' }}>
        {loading ? (
          <div className="loading-state">Carregando cantina...</div>
        ) : (
          <div className="spreadsheet-container">
            <table className="spreadsheet-table">
              <thead>
                <tr>
                  <th style={{ minWidth: '300px' }}>Nome Completo</th>
                  <th>Idade</th>
                  <th>Equipe</th>
                  <th>Quarto</th>
                  <th>Saldo Atual</th>
                  <th>Operações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => {
                  const saldo = reg.saldo_cantina ? parseFloat(reg.saldo_cantina) : 0;
                  return (
                    <tr key={reg.id}>
                      <td style={{ fontWeight: 'bold' }}>{reg.nome_completo}</td>
                      <td style={{ textAlign: 'center' }}>{reg.idade}</td>
                      <td style={{ textAlign: 'center' }}>{reg.equipe || '-'}</td>
                      <td style={{ textAlign: 'center' }}>{reg.quarto || '-'}</td>
                      <td style={{ 
                        fontWeight: 'bold', 
                        textAlign: 'right', 
                        fontSize: '1.1rem',
                        color: saldo < 0 ? '#ef4444' : (saldo > 0 ? '#10b981' : 'inherit')
                      }}>
                        {formatCurrency(saldo)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button 
                            className="btn-small" 
                            style={{ backgroundColor: '#10b981', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.3rem 0.6rem' }}
                            onClick={() => handleDeposit(reg)}
                          >
                            <Plus size={14} /> Depositar
                          </button>
                          <button 
                            className="btn-small" 
                            style={{ backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.3rem 0.6rem' }}
                            onClick={() => handlePurchase(reg)}
                          >
                            <Minus size={14} /> Comprar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4" style={{ backgroundColor: 'white', color: '#666' }}>
                      Nenhum campista encontrado.
                    </td>
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
