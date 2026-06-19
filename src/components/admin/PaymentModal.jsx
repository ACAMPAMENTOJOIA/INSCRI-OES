import { useState } from 'react';
import { updatePaymentData } from '../../services/admin.service';

export default function PaymentModal({ selectedReg, onClose, onSuccess }) {
  const eventPrice = selectedReg.events?.price ? parseFloat(selectedReg.events.price) : 0;
  
  const [valorPago, setValorPago] = useState(
    selectedReg.valor_pago ? parseFloat(selectedReg.valor_pago) : 0
  );
  const [saving, setSaving] = useState(false);

  const handleQuickAdd = (amount) => {
    setValorPago(prev => prev + amount);
  };

  const handleSetFull = () => {
    setValorPago(eventPrice);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let status = 'Pendente';
      if (valorPago > 0 && valorPago < eventPrice) {
        status = 'Parcial';
      } else if (valorPago >= eventPrice && eventPrice > 0) {
        status = 'Pago';
      } else if (valorPago > 0 && eventPrice === 0) {
        status = 'Pago';
      }

      await updatePaymentData(selectedReg.id, status, valorPago);
      onSuccess(status, valorPago);
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar pagamento.');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="modal-overlay" onClick={() => !saving && onClose()}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3>Registrar Pagamento</h3>
          <button className="close-btn" onClick={onClose} disabled={saving}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>Inscrito: {selectedReg.nome_completo}</p>
            <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>
              Evento: {selectedReg.events?.title || 'Nenhum'}<br/>
              Valor Total do Evento: <strong>{formatCurrency(eventPrice)}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Valor Pago até o momento (R$)</label>
              <input 
                type="number" 
                step="0.01" 
                min="0"
                value={valorPago} 
                onChange={e => setValorPago(parseFloat(e.target.value) || 0)} 
                required 
                style={{ fontSize: '1.2rem', padding: '0.75rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn-small" style={{ backgroundColor: '#e5e7eb', color: '#374151' }} onClick={() => handleQuickAdd(50)}>+ R$ 50</button>
              <button type="button" className="btn-small" style={{ backgroundColor: '#e5e7eb', color: '#374151' }} onClick={() => handleQuickAdd(100)}>+ R$ 100</button>
              <button type="button" className="btn-small" style={{ backgroundColor: '#dcfce3', color: '#166534', flex: 1 }} onClick={handleSetFull}>
                Quitar (Valor Total)
              </button>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
              {saving ? 'Salvando...' : 'Confirmar Pagamento'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
