export default function RegistrationModal({ selectedReg, onClose }) {
  if (!selectedReg) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalhes da Inscrição</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div><strong>Evento:</strong> <span style={{color:'var(--primary-color)', fontWeight:'bold'}}>{selectedReg.events?.title || 'Desconhecido'}</span></div>
            <hr style={{ gridColumn: '1 / -1', margin: '5px 0' }} />
            
            <div><strong>Nome:</strong> {selectedReg.nome_completo}</div>
            <div><strong>Idade:</strong> {selectedReg.idade} | <strong>Sexo:</strong> {selectedReg.sexo}</div>
            <div><strong>Telefone:</strong> {selectedReg.telefone}</div>
            <div><strong>Email:</strong> {selectedReg.email || '-'}</div>
            <hr style={{ gridColumn: '1 / -1', margin: '10px 0' }} />
            
            <div><strong>Endereço:</strong> {selectedReg.rua}, {selectedReg.bairro}, {selectedReg.cidade} - {selectedReg.estado}</div>
            <hr style={{ gridColumn: '1 / -1', margin: '10px 0' }} />
            
            <div style={{ gridColumn: '1 / -1' }}>
              <h4 style={{marginBottom: '10px'}}>Saúde e Emergência</h4>
              <p><strong>Tipo Sanguíneo:</strong> {selectedReg.tipo_sanguineo || '-'}</p>
              <p><strong>Problema de Saúde:</strong> {selectedReg.problema_saude} {selectedReg.problema_saude === 'Sim' ? `- ${selectedReg.problema_saude_qual}` : ''}</p>
              <p><strong>Proibição Médica:</strong> {selectedReg.proibicao_medica} {selectedReg.proibicao_medica === 'Sim' ? `- ${selectedReg.proibicao_medica_qual}` : ''}</p>
              <p><strong>Alergia a Medicamento:</strong> {selectedReg.alergia_medicamento} {selectedReg.alergia_medicamento === 'Sim' ? `- ${selectedReg.alergia_medicamento_qual}` : ''}</p>
              <p><strong>Tomando Remédio:</strong> {selectedReg.tomando_remedio} {selectedReg.tomando_remedio === 'Sim' ? `- ${selectedReg.tomando_remedio_qual}` : ''}</p>
              <p><strong>Contato de Emergência:</strong> {selectedReg.emergencia_nome} - {selectedReg.emergencia_telefone}</p>
            </div>
            <hr style={{ gridColumn: '1 / -1', margin: '10px 0' }} />

            <div style={{ gridColumn: '1 / -1' }}>
              <h4 style={{marginBottom: '10px'}}>Dados Eclesiásticos</h4>
              <p><strong>Igreja:</strong> {selectedReg.igreja}</p>
              <p><strong>Membro:</strong> {selectedReg.membro}</p>
              <p><strong>Crente:</strong> {selectedReg.crente} {selectedReg.crente === 'Sim' ? `- Anos: ${selectedReg.crente_anos}` : ''}</p>
            </div>
            <hr style={{ gridColumn: '1 / -1', margin: '10px 0' }} />

            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Observações:</strong>
              <p>{selectedReg.outros || 'Nenhuma'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
