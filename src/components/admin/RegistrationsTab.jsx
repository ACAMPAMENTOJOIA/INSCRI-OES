import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { fetchAllRegistrations } from '../../services/admin.service';
import RegistrationModal from './RegistrationModal';

export default function RegistrationsTab() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);

  useEffect(() => {
    const loadRegistrations = async () => {
      const data = await fetchAllRegistrations();
      setRegistrations(data);
      setLoading(false);
    };
    loadRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter(reg => 
    reg.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reg.telefone && reg.telefone.includes(searchTerm))
  );

  return (
    <>
      <header className="admin-header">
        <h2>Lista de Inscritos ({registrations.length})</h2>
        <div className="search-bar">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="admin-content">
        {loading ? (
          <div className="loading-state">Carregando inscrições...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Evento</th>
                  <th>Telefone</th>
                  <th>Data Inscrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>{reg.nome_completo}</td>
                    <td>{reg.events?.title || '-'}</td>
                    <td>{reg.telefone}</td>
                    <td>{new Date(reg.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <button className="btn-small" onClick={() => setSelectedReg(reg)}>
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">Nenhuma inscrição encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedReg && (
        <RegistrationModal selectedReg={selectedReg} onClose={() => setSelectedReg(null)} />
      )}
    </>
  );
}
