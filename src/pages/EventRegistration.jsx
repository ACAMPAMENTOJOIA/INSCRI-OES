import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, submitRegistration } from '../services/events.service';
import Footer from '../components/Footer';
import './LandingPage.css'; // Podemos reaproveitar os estilos do formulário

export default function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const [formData, setFormData] = useState({
    nome_completo: '',
    rua: '', bairro: '', cidade: '', estado: '',
    telefone: '', tipo_sanguineo: '',
    problema_saude: 'Não', problema_saude_qual: '',
    proibicao_medica: 'Não', proibicao_medica_qual: '',
    alergia_medicamento: 'Não', alergia_medicamento_qual: '',
    tomando_remedio: 'Não', tomando_remedio_qual: '',
    emergencia_nome: '', emergencia_telefone: '',
    igreja: '', membro: 'Não',
    sexo: '', idade: '',
    crente: 'Não', crente_anos: '',
    email: '', outros: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await getEventById(id);
        setEventDetails(data);
      } catch (err) {
        setError('Evento não encontrado.');
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'Sim' : 'Não') : value
    }));
  };

  const handleRadioChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await submitRegistration(formData, id);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('Houve um erro ao enviar sua inscrição. Verifique sua conexão ou contate a organização.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingEvent) {
    return <div className="loading-screen">Carregando detalhes do evento...</div>;
  }

  if (success) {
    return (
      <div className="success-screen">
        <div className="success-content">
          <img src="/assets/logo-verde.png" alt="Logo Jóia" className="success-logo" />
          <h1>Inscrição Recebida!</h1>
          <p>Obrigado por se inscrever no <strong>{eventDetails?.title}</strong>.</p>
          <p>Sua inscrição foi registrada com sucesso.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>Voltar aos Eventos</button>
        </div>
      </div>
    );
  }

  if (!eventDetails) {
    return <div className="error-message" style={{ margin: '50px' }}>Evento não encontrado. <button onClick={() => navigate('/')}>Voltar</button></div>;
  }

  return (
    <div className="landing-page">
      <header className="hero-section" style={{ height: '40vh', minHeight: '300px' }}>
        <div className="hero-overlay"></div>
        {eventDetails.cover_url ? (
          <img src={eventDetails.cover_url} alt={eventDetails.title} className="hero-bg" />
        ) : (
          <img src="/assets/iguana.jpeg" alt="Fundo" className="hero-bg" />
        )}
        <div className="hero-content">
          <h1>{eventDetails.title}</h1>
          <p>{eventDetails.date_description}</p>
        </div>
      </header>

      {/* Form Section */}
      <section className="form-section container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div className="form-card">
          <button className="btn btn-secondary" style={{ marginBottom: '2rem' }} onClick={() => navigate('/')}>&larr; Voltar</button>
          
          <h2 style={{ marginBottom: '5px' }}>Ficha de Inscrição</h2>
          <p className="text-center" style={{ marginBottom: '2rem', color: '#666' }}>
            Preencha todos os dados abaixo para confirmar sua vaga no evento <strong>{eventDetails.title}</strong>.
          </p>

          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-section-title">Dados Pessoais</div>
            <div className="form-group">
              <label>Nome completo *</label>
              <input type="text" name="nome_completo" value={formData.nome_completo} onChange={handleChange} required />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Telefone *</label>
                <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Sexo *</label>
                <select name="sexo" value={formData.sexo} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>
              <div className="form-group">
                <label>Idade *</label>
                <input type="number" name="idade" value={formData.idade} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-section-title">Endereço</div>
            <div className="form-group">
              <label>Rua</label>
              <input type="text" name="rua" value={formData.rua} onChange={handleChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Bairro</label>
                <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Cidade</label>
                <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <input type="text" name="estado" value={formData.estado} onChange={handleChange} />
              </div>
            </div>

            <div className="form-section-title">Saúde e Emergência</div>
            <div className="form-row">
              <div className="form-group">
                <label>Tipo Sanguíneo</label>
                <input type="text" name="tipo_sanguineo" value={formData.tipo_sanguineo} onChange={handleChange} placeholder="Ex: O+, A-" />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Problema de saúde?</label>
                <div className="radio-group">
                  <label><input type="radio" name="problema_saude" value="Sim" checked={formData.problema_saude === 'Sim'} onChange={handleRadioChange} /> Sim</label>
                  <label><input type="radio" name="problema_saude" value="Não" checked={formData.problema_saude === 'Não'} onChange={handleRadioChange} /> Não</label>
                </div>
              </div>
              {formData.problema_saude === 'Sim' && (
                <div className="form-group">
                  <label>Qual?</label>
                  <input type="text" name="problema_saude_qual" value={formData.problema_saude_qual} onChange={handleChange} />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Proibição médica?</label>
                <div className="radio-group">
                  <label><input type="radio" name="proibicao_medica" value="Sim" checked={formData.proibicao_medica === 'Sim'} onChange={handleRadioChange} /> Sim</label>
                  <label><input type="radio" name="proibicao_medica" value="Não" checked={formData.proibicao_medica === 'Não'} onChange={handleRadioChange} /> Não</label>
                </div>
              </div>
              {formData.proibicao_medica === 'Sim' && (
                <div className="form-group">
                  <label>Qual?</label>
                  <input type="text" name="proibicao_medica_qual" value={formData.proibicao_medica_qual} onChange={handleChange} />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tem alergia a algum medicamento?</label>
                <div className="radio-group">
                  <label><input type="radio" name="alergia_medicamento" value="Sim" checked={formData.alergia_medicamento === 'Sim'} onChange={handleRadioChange} /> Sim</label>
                  <label><input type="radio" name="alergia_medicamento" value="Não" checked={formData.alergia_medicamento === 'Não'} onChange={handleRadioChange} /> Não</label>
                </div>
              </div>
              {formData.alergia_medicamento === 'Sim' && (
                <div className="form-group">
                  <label>Qual?</label>
                  <input type="text" name="alergia_medicamento_qual" value={formData.alergia_medicamento_qual} onChange={handleChange} />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Está tomando algum remédio?</label>
                <div className="radio-group">
                  <label><input type="radio" name="tomando_remedio" value="Sim" checked={formData.tomando_remedio === 'Sim'} onChange={handleRadioChange} /> Sim</label>
                  <label><input type="radio" name="tomando_remedio" value="Não" checked={formData.tomando_remedio === 'Não'} onChange={handleRadioChange} /> Não</label>
                </div>
              </div>
              {formData.tomando_remedio === 'Sim' && (
                <div className="form-group">
                  <label>Qual?</label>
                  <input type="text" name="tomando_remedio_qual" value={formData.tomando_remedio_qual} onChange={handleChange} />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Em caso de acidente avisar?</label>
                <input type="text" name="emergencia_nome" value={formData.emergencia_nome} onChange={handleChange} placeholder="Nome do contato" />
              </div>
              <div className="form-group">
                <label>Telefone de Emergência</label>
                <input type="tel" name="emergencia_telefone" value={formData.emergencia_telefone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-section-title">Dados Eclesiásticos</div>
            <div className="form-row">
              <div className="form-group">
                <label>Igreja</label>
                <input type="text" name="igreja" value={formData.igreja} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Membro?</label>
                <div className="radio-group">
                  <label><input type="radio" name="membro" value="Sim" checked={formData.membro === 'Sim'} onChange={handleRadioChange} /> Sim</label>
                  <label><input type="radio" name="membro" value="Não" checked={formData.membro === 'Não'} onChange={handleRadioChange} /> Não</label>
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Crente?</label>
                <div className="radio-group">
                  <label><input type="radio" name="crente" value="Sim" checked={formData.crente === 'Sim'} onChange={handleRadioChange} /> Sim</label>
                  <label><input type="radio" name="crente" value="Não" checked={formData.crente === 'Não'} onChange={handleRadioChange} /> Não</label>
                </div>
              </div>
              {formData.crente === 'Sim' && (
                <div className="form-group">
                  <label>Quantos anos?</label>
                  <input type="text" name="crente_anos" value={formData.crente_anos} onChange={handleChange} />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Outros (Observações)</label>
              <textarea name="outros" value={formData.outros} onChange={handleChange} rows="3"></textarea>
            </div>

            <div className="termo-aceite">
              <p>
                Ao enviar este formulário, confirmo que li e concordo com os regulamentos do Acampamento Jóia e que os dados acima são verdadeiros.
              </p>
            </div>

            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              {loading ? 'Enviando...' : 'Confirmar Inscrição'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
