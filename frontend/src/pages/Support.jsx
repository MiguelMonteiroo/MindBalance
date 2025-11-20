import React from 'react';

function Support() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4 text-center">🆘 Suporte e Ajuda</h2>
          
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">📞 Canais de Apoio</h5>
              <p className="text-muted">Página em desenvolvimento.</p>
              <p>Aqui você encontrará:</p>
              <ul>
                <li>Contatos de profissionais de saúde mental</li>
                <li>Serviço de Apoio ao Funcionário (SAF)</li>
                <li>FAQs sobre bem-estar</li>
                <li>Chat de suporte</li>
              </ul>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">❓ Perguntas Frequentes</h5>
              <p className="text-muted">Em breve, uma lista completa de FAQs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
