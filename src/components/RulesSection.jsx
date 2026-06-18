export default function RulesSection() {
  return (
    <div className="rules-section-wrapper">
      <section className="rules-section container">
        <div className="rules-card">
          <h2>Regulamento Geral do Acampamento</h2>
          <p className="rules-intro">Ao se inscrever em qualquer evento, você concorda com os princípios do Ministério Jóia. Pedimos cooperação com as seguintes regras:</p>
          
          <div className="rules-grid">
            <div className="rule-box">
              <h3>Não é permitido</h3>
              <ul>
                <li>Cigarros, Drogas e Bebidas Alcoólicas</li>
                <li>Músicas e Danças Mundanas</li>
                <li>Namoro indecente e Palavras feias</li>
                <li>Falta de cooperação</li>
                <li>Aparelhos eletrônicos musicais (pessoal ou coletivo)</li>
              </ul>
              <small>Permitido: Câmeras e celular apenas para comunicação pessoal.</small>
            </div>
            
            <div className="rule-box">
              <h3>Vestimenta - Homens</h3>
              <ul>
                <li><strong>Na Capela:</strong> Calça comprida e camisa</li>
                <li><strong>Nos esportes:</strong> Shorts</li>
                <li><strong>No banho de açude:</strong> Short ou bermuda e camisa</li>
              </ul>
            </div>
            
            <div className="rule-box">
              <h3>Vestimenta - Mulheres</h3>
              <ul>
                <li><strong>Na Capela:</strong> Vestido, saia longa ou calça comprida</li>
                <li><strong>Nos esportes:</strong> Permitido usar bermuda</li>
                <li><strong>No banho de açude:</strong> Short e blusa escura</li>
                <li><strong>Evite:</strong> Vestido ou saia acima do joelho, mini blusa com alça, roupa justa e transparente.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
