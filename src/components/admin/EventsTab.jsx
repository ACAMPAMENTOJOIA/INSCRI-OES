import { useState, useEffect } from 'react';
import { CalendarPlus, Edit2, Trash2, Power, PowerOff } from 'lucide-react';
import { fetchAllEvents, toggleEventStatus, deleteEvent } from '../../services/admin.service';
import EventFormModal from './EventFormModal';

export default function EventsTab() {
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const loadEvents = async () => {
    const data = await fetchAllEvents();
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleToggleActive = async (id, currentStatus) => {
    if (window.confirm(`Tem certeza que deseja ${currentStatus ? 'desativar' : 'ativar'} este evento?`)) {
      const success = await toggleEventStatus(id, currentStatus);
      if (success) {
        loadEvents();
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('ALERTA: Tem certeza que deseja excluir DEFINITIVAMENTE este evento? Todas as inscrições atreladas a ele também serão excluídas!')) {
      const success = await deleteEvent(id);
      if (success) {
        loadEvents();
      }
    }
  };

  const handleEdit = (ev) => {
    setEditingEvent(ev);
    setShowEventForm(true);
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn-small" 
                        title={ev.active ? 'Desativar' : 'Ativar'}
                        style={{ backgroundColor: ev.active ? '#ef4444' : '#10b981', padding: '0.4rem' }}
                        onClick={() => handleToggleActive(ev.id, ev.active)}
                      >
                        {ev.active ? <PowerOff size={16} /> : <Power size={16} />}
                      </button>
                      <button 
                        className="btn-small" 
                        title="Editar Evento"
                        style={{ backgroundColor: '#3b82f6', padding: '0.4rem' }}
                        onClick={() => handleEdit(ev)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn-small" 
                        title="Excluir Evento"
                        style={{ backgroundColor: '#1f2937', padding: '0.4rem' }}
                        onClick={() => handleDelete(ev.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
          initialData={editingEvent}
          onClose={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }} 
          onSuccess={() => {
            setShowEventForm(false);
            setEditingEvent(null);
            loadEvents();
          }} 
        />
      )}
    </>
  );
}
