import React, { useState } from 'react';

function Support() {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const faqs = [
    {
      question: "Como o MindBalance protege minha privacidade?",
      answer: "Seus check-ins individuais são completamente privados. Os gestores veem apenas dados agregados e anônimos. Nenhum check-in específico é compartilhado sem seu consentimento. Seus dados são criptografados e protegidos conforme a LGPD."
    },
    {
      question: "Com que frequência devo fazer check-ins?",
      answer: "Recomendamos fazer check-ins diários, de preferência no mesmo horário. Isso leva apenas 2 minutos e ajuda a criar um histórico preciso do seu bem-estar. Se não conseguir fazer todos os dias, tente ao menos 3-4 vezes por semana."
    },
    {
      question: "O que acontece se eu reportar estar mal?",
      answer: "Você receberá sugestões personalizadas da IA e recursos de autocuidado. Se houver um padrão preocupante (ex: vários dias consecutivos com humor baixo), o sistema gera alertas anônimos para o RH, que pode oferecer apoio sem violar sua privacidade."
    },
    {
      question: "Meu gestor pode ver meus check-ins individuais?",
      answer: "Não. Os gestores veem apenas estatísticas agregadas da equipe (ex: 'a equipe teve média de humor 3.5 esta semana'). Eles não conseguem ver check-ins individuais ou identificar quem está passando por dificuldades específicas."
    },
    {
      question: "E se eu precisar de ajuda profissional?",
      answer: "A plataforma oferece links diretos para canais de apoio: psicólogos da empresa, SAF (Serviço de Apoio ao Funcionário), CVV (188), e outros recursos. O MindBalance não substitui ajuda profissional, mas ajuda a identificar quando você pode precisar dela."
    },
    {
      question: "Posso deletar meus dados?",
      answer: "Sim, você tem total controle sobre seus dados. Pode solicitar a exclusão completa do seu histórico a qualquer momento através das configurações ou entrando em contato com o RH. Isso está em conformidade com a LGPD."
    }
  ];

  const supportChannels = [
    {
      icon: "💬",
      title: "Chat Online",
      description: "Converse com nossa equipe de suporte",
      action: "Iniciar Chat",
      available: "Seg-Sex, 9h-18h"
    },
    {
      icon: "📧",
      title: "Email",
      description: "suporte@mindbalance.com",
      action: "Enviar Email",
      available: "Resposta em até 24h"
    },
    {
      icon: "🤝",
      title: "RH",
      description: "Fale com o departamento de Recursos Humanos",
      action: "Contatar RH",
      available: "Seg-Sex, 8h-17h"
    }
  ];

  const emergencyContacts = [
    {
      name: "CVV - Centro de Valorização da Vida",
      phone: "188",
      description: "Apoio emocional e prevenção do suicídio",
      available: "24h, todos os dias"
    },
    {
      name: "CAPS - Centro de Atenção Psicossocial",
      phone: "Varia por cidade",
      description: "Atendimento gratuito em saúde mental",
      available: "Consulte unidade mais próxima"
    },
    {
      name: "SAF - Serviço de Apoio ao Funcionário",
      phone: "(11) 1234-5678",
      description: "Apoio psicológico para colaboradores",
      available: "Seg-Sex, 8h-20h"
    }
  ];

  return (
    <div className="support-page">
      {/* Header */}
      <div className="gradient-primary text-white py-4 mb-4">
        <div className="container">
          <h2 className="mb-1">🆘 Suporte e Ajuda</h2>
          <p className="mb-0 opacity-75">Estamos aqui para você</p>
        </div>
      </div>

      <div className="container pb-5">
        {/* Alert de Emergência */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger border-0 shadow-sm">
              <div className="d-flex align-items-start">
                <span className="fs-3 me-3">🚨</span>
                <div className="flex-grow-1">
                  <h5 className="alert-heading">Em caso de emergência</h5>
                  <p className="mb-2">
                    Se você está em crise ou pensando em se machucar, busque ajuda imediatamente:
                  </p>
                  <div className="d-flex gap-3 flex-wrap">
                    <a href="tel:188" className="btn btn-light btn-sm">
                      <i className="bi bi-telephone-fill me-2"></i>
                      CVV: 188
                    </a>
                    <a href="tel:192" className="btn btn-light btn-sm">
                      <i className="bi bi-telephone-fill me-2"></i>
                      SAMU: 192
                    </a>
                    <a href="tel:190" className="btn btn-light btn-sm">
                      <i className="bi bi-telephone-fill me-2"></i>
                      Polícia: 190
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canais de Suporte */}
        <div className="row mb-5">
          <div className="col-12 mb-4">
            <h4>📞 Canais de Atendimento</h4>
            <p className="text-muted">Escolha o canal mais adequado para sua necessidade</p>
          </div>
          {supportChannels.map((channel, index) => (
            <div key={index} className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="fs-1 mb-3">{channel.icon}</div>
                  <h5 className="card-title">{channel.title}</h5>
                  <p className="card-text text-muted small">{channel.description}</p>
                  <p className="small text-muted mb-3">
                    <i className="bi bi-clock me-1"></i>
                    {channel.available}
                  </p>
                  <button className="btn btn-primary btn-sm">
                    {channel.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contatos de Emergência */}
        <div className="row mb-5">
          <div className="col-12 mb-4">
            <h4>🆘 Contatos de Emergência</h4>
            <p className="text-muted">Serviços de apoio profissional disponíveis</p>
          </div>
          <div className="col-12">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h6 className="mb-1">{contact.name}</h6>
                      <p className="text-muted small mb-2">{contact.description}</p>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {contact.available}
                      </small>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                      <a href={`tel:${contact.phone}`} className="btn btn-outline-primary">
                        <i className="bi bi-telephone-fill me-2"></i>
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="row mb-5">
          <div className="col-12 mb-4">
            <h4>❓ Perguntas Frequentes</h4>
            <p className="text-muted">Encontre respostas rápidas para dúvidas comuns</p>
          </div>
          <div className="col-12">
            <div className="accordion" id="faqAccordion">
              {faqs.map((faq, index) => (
                <div key={index} className="accordion-item border-0 shadow-sm mb-3">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${activeAccordion === index ? '' : 'collapsed'}`}
                      type="button"
                      onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                    >
                      <strong>{faq.question}</strong>
                    </button>
                  </h2>
                  <div
                    className={`accordion-collapse collapse ${activeAccordion === index ? 'show' : ''}`}
                  >
                    <div className="accordion-body">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recursos Adicionais */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card bg-light border-0 h-100">
              <div className="card-body">
                <h6 className="card-title">📚 Biblioteca de Recursos</h6>
                <p className="small text-muted mb-3">
                  Acesse técnicas de autocuidado, mindfulness e gestão de estresse.
                </p>
                <a href="/resources" className="btn btn-outline-primary btn-sm">
                  Ver Recursos
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="card bg-light border-0 h-100">
              <div className="card-body">
                <h6 className="card-title">💬 Comunidade</h6>
                <p className="small text-muted mb-3">
                  Participe de grupos de apoio e compartilhe experiências (em breve).
                </p>
                <button className="btn btn-outline-primary btn-sm" disabled>
                  Em Breve
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-primary">
              <div className="card-body text-center">
                <h5 className="card-title text-primary">💙 Você não está sozinho(a)</h5>
                <p className="mb-0">
                  Buscar ajuda é um sinal de força, não de fraqueza. 
                  Estamos aqui para apoiar você em sua jornada de bem-estar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
