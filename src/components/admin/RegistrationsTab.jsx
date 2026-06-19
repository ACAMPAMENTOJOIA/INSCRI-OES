import { useState, useEffect } from 'react';
import { Search, Download, FileText } from 'lucide-react';
import { fetchAllRegistrations, fetchAllEvents } from '../../services/admin.service';
import RegistrationModal from './RegistrationModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function RegistrationsTab() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [regsData, eventsData] = await Promise.all([
        fetchAllRegistrations(),
        fetchAllEvents()
      ]);
      setRegistrations(regsData);
      setEvents(eventsData);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (reg.telefone && reg.telefone.includes(searchTerm));
    const matchesEvent = selectedEvent === '' || reg.event_id === selectedEvent;
    return matchesSearch && matchesEvent;
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Nome", "Telefone", "Igreja", "Sexo", "Idade", "Sangue", "Membro"];
    const tableRows = [];

    filteredRegistrations.forEach(reg => {
      const rowData = [
        reg.nome_completo,
        reg.telefone || '-',
        reg.igreja || '-',
        reg.sexo || '-',
        reg.idade || '-',
        reg.tipo_sanguineo || '-',
        reg.membro || '-'
      ];
      tableRows.push(rowData);
    });

    const eventName = selectedEvent 
      ? events.find(e => e.id === selectedEvent)?.title 
      : 'Todos os Eventos';

    doc.text(`Relatório de Inscrições: ${eventName}`, 14, 15);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [43, 110, 76] }
    });

    doc.save(`inscricoes_${new Date().getTime()}.pdf`);
  };

  const exportToExcel = () => {
    // Formatar os dados para que o Excel fique mais legível
    const dataToExport = filteredRegistrations.map(reg => ({
      'Nome Completo': reg.nome_completo,
      'Evento': reg.events?.title || '-',
      'Data de Inscrição': new Date(reg.created_at).toLocaleDateString('pt-BR'),
      'Telefone': reg.telefone,
      'E-mail': reg.email || '-',
      'Sexo': reg.sexo,
      'Idade': reg.idade,
      'Igreja': reg.igreja,
      'Membro': reg.membro,
      'Crente': reg.crente,
      'Rua': reg.rua,
      'Bairro': reg.bairro,
      'Cidade': reg.cidade,
      'Estado': reg.estado,
      'Tipo Sanguíneo': reg.tipo_sanguineo,
      'Problema de Saúde': reg.problema_saude === 'Sim' ? reg.problema_saude_qual : 'Não',
      'Proibição Médica': reg.proibicao_medica === 'Sim' ? reg.proibicao_medica_qual : 'Não',
      'Alergia': reg.alergia_medicamento === 'Sim' ? reg.alergia_medicamento_qual : 'Não',
      'Toma Remédio': reg.tomando_remedio === 'Sim' ? reg.tomando_remedio_qual : 'Não',
      'Contato Emergência': reg.emergencia_nome,
      'Telefone Emergência': reg.emergencia_telefone,
      'Outros/Obs': reg.outros
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inscrições");
    XLSX.writeFile(workbook, `inscricoes_${new Date().getTime()}.xlsx`);
  };

  return (
    <>
      <header className="admin-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Lista de Inscritos ({filteredRegistrations.length})</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
          
          <select 
            value={selectedEvent} 
            onChange={(e) => setSelectedEvent(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', outline: 'none' }}
          >
            <option value="">Todos os Eventos</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>

          <div className="search-bar" style={{ margin: 0 }}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou telefone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button onClick={exportToPDF} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <FileText size={16} /> PDF
          </button>
          
          <button onClick={exportToExcel} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <Download size={16} /> Excel
          </button>
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
