import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveEvents } from '../services/events.service';

export default function EventsGallery() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getActiveEvents();
      setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <section id="eventos" className="events-section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}>Nossos Retiros</h2>
          <p style={{ color: '#666', fontSize: '1.2rem' }}>Garanta sua vaga nos próximos eventos do Ministério Jóia.</p>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ height: '200px' }}>Carregando eventos...</div>
        ) : (
          <div className="events-grid">
            {events.length === 0 ? (
              <p className="text-center" style={{ gridColumn: '1 / -1', padding: '2rem' }}>Nenhum evento com inscrições abertas no momento.</p>
            ) : (
              events.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-cover">
                    {event.cover_url ? (
                      <img src={event.cover_url} alt={event.title} />
                    ) : (
                      <div className="event-cover-placeholder">
                        <img src="/assets/logo-verde.png" alt="Logo" style={{ maxWidth: '80px', opacity: 0.5 }} />
                      </div>
                    )}
                  </div>
                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <div className="event-info-line">
                      <strong>Data:</strong> <span>{event.date_description}</span>
                    </div>
                    {event.speaker && (
                      <div className="event-info-line">
                        <strong>Preletor:</strong> <span>{event.speaker}</span>
                      </div>
                    )}
                    {event.price && (
                      <div className="event-info-line">
                        <strong>Valor:</strong> <span>R$ {Number(event.price).toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    <button 
                      className="btn btn-primary event-action-btn" 
                      onClick={() => navigate(`/inscricao/${event.id}`)}
                    >
                      Quero me inscrever
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
