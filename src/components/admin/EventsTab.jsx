import { useState, useEffect } from 'react';
import { CalendarPlus } from 'lucide-react';
import { fetchAllEvents, toggleEventStatus } from '../../services/admin.service';
import EventFormModal from './EventFormModal';

export default function EventsTab() {
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);

  const loadEvents = async () => {
    const data = await fetchAllEvents();
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleToggleActive = async (id, currentStatus) => {
    const success = await toggleEventStatus(id, currentStatus);
    if (success) {
      loadEvents();
    }
  };

  return (
    <>
      <header className="admin-header">
        <h2>Gerenciar Eventos</h2>
        <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} onClick={() => setShowEventForm(true)}>
          <CalendarPlus size={18} /> Novo Evento
        </button>
      </header>

      <div className="admin-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Título do Evento</th>
                <th>Data</th>
                <th>Preletor</th>
                <th>Valor (R$)</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td><strong>{ev.title}</strong></td>
                  <td>{ev.date_description}</td>
                  <td>{ev.speaker || '-'}</td>
                  <td>{ev.price ? ev.price : '-'}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: ev.active ? '#dcfce3' : '#fee2e2', 
                      color: ev.active ? '#166534' : '#991b1b' 
                    }}>
                      {ev.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-small" onClick={() => handleToggleActive(ev.id, ev.active)}>
                      {ev.active ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">Nenhum evento cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEventForm && (
        <EventFormModal 
          onClose={() => setShowEventForm(false)} 
          onSuccess={() => {
            setShowEventForm(false);
            loadEvents();
          }} 
        />
      )}
    </>
  );
}
