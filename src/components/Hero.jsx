export default function Hero() {
  return (
    <header className="hero-section">
      <div className="hero-overlay"></div>
      <img src="/assets/iguana-nova.png" alt="Iguana Acampamento Jóia" className="hero-bg" />
      <div className="hero-content">
        <img src="/assets/logo-branco.png" alt="Acampamento Jóia" className="hero-logo" />
        <h1>Portal de Eventos</h1>
        <p>Prepare-se para viver momentos inesquecíveis. Escolha seu próximo retiro.</p>
        <a href="#eventos" className="btn btn-primary hero-btn">Ver Próximos Eventos</a>
      </div>
    </header>
  );
}
