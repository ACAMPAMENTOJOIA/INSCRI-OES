import { useState, useEffect } from 'react';
import { createEvent, updateEvent } from '../../services/admin.service';

export default function EventFormModal({ onClose, onSuccess, initialData = null }) {
  const [newEvent, setNewEvent] = useState(
    initialData || { title: '', date_description: '', speaker: '', price: '' }
  );
  const [coverFile, setCoverFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      if (initialData) {
        await updateEvent(initialData.id, newEvent, coverFile);
        alert('Evento atualizado com sucesso!');
      } else {
        await createEvent(newEvent, coverFile);
        alert('Evento cadastrado com sucesso!');
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      alert('Erro ao salvar evento. Verifique as configurações de Storage.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => !uploading && onClose()}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>{initialData ? 'Editar Evento' : 'Cadastrar Novo Evento'}</h3>
          <button className="close-btn" onClick={onClose} disabled={uploading}>&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título do Evento *</label>
              <input type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required placeholder="Ex: Retiro de Jovens" />
            </div>
            <div className="form-group">
              <label>Data / Período *</label>
              <input type="text" value={newEvent.date_description} onChange={e => setNewEvent({...newEvent, date_description: e.target.value})} required placeholder="Ex: 14 a 18 de Fevereiro" />
            </div>
            <div className="form-group">
              <label>Preletor (Opcional)</label>
              <input type="text" value={newEvent.speaker} onChange={e => setNewEvent({...newEvent, speaker: e.target.value})} placeholder="Nome do preletor" />
            </div>
            <div className="form-group">
              <label>Valor de Investimento (R$) (Opcional)</label>
              <input type="number" step="0.01" value={newEvent.price} onChange={e => setNewEvent({...newEvent, price: e.target.value})} placeholder="Ex: 390.00" />
            </div>
            <div className="form-group">
              <label>Imagem da Capa/Folder (Opcional)</label>
              <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} style={{ padding: '0' }} />
              <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>O ideal é enviar o folder na vertical ou quadrado.</small>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={uploading}>
              {uploading ? 'Salvando Evento e Fazendo Upload...' : 'Salvar Evento'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
