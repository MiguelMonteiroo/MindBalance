import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero gradient-primary text-white py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4 fade-in">
                Cuidar de quem cuida do futuro
              </h1>
              <p className="lead mb-4 fade-in">
                Transforme a saúde mental em prioridade no seu ambiente de trabalho. 
                O MindBalance ajuda colaboradores e gestores a prevenirem burnout e 
                promoverem bem-estar de forma inteligente.
              </p>
              <div className="d-flex gap-3 fade-in">
                <Link to="/login" className="btn btn-light btn-lg px-4">
                  Começar Agora
                </Link>
                <a href="#sobre" className="btn btn-outline-light btn-lg px-4">
                  Saiba Mais
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center fade-in">
              <div className="p-5">
                <svg
                  width="400"
                  height="300"
                  viewBox="0 0 400 300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="img-fluid"
                >
                  <circle cx="200" cy="150" r="100" fill="rgba(255,255,255,0.2)" />
                  <circle cx="200" cy="150" r="70" fill="rgba(255,255,255,0.3)" />
                  <text
                    x="200"
                    y="160"
                    fontSize="60"
                    textAnchor="middle"
                    fill="white"
                  >
                    🧠
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="sobre" className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Por que MindBalance?</h2>
            <p className="lead text-muted">
              Uma solução completa para o bem-estar no trabalho
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <div className="fs-1 mb-3">🛡️</div>
                  <h5 className="card-title fw-bold">Prevenção Ativa</h5>
                  <p className="card-text text-muted">
                    Identifique sinais de burnout antes que se tornem críticos. 
                    Check-ins diários de 2 minutos ajudam a monitorar o bem-estar.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <div className="fs-1 mb-3">🤖</div>
                  <h5 className="card-title fw-bold">IA como Parceira</h5>
                  <p className="card-text text-muted">
                    Sugestões personalizadas baseadas no seu histórico. 
                    A tecnologia amplifica o cuidado humano, não o substitui.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <div className="fs-1 mb-3">🔒</div>
                  <h5 className="card-title fw-bold">Privacidade Garantida</h5>
                  <p className="card-text text-muted">
                    Seus dados são protegidos. Gestores veem apenas dados 
                    agregados e anônimos. Você tem controle total.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <div className="fs-1 mb-3">📊</div>
                  <h5 className="card-title fw-bold">Insights Acionáveis</h5>
                  <p className="card-text text-muted">
                    Dashboards com dados em tempo real para gestores. 
                    Tome decisões baseadas em dados, não em achismos.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <div className="fs-1 mb-3">📚</div>
                  <h5 className="card-title fw-bold">Recursos Práticos</h5>
                  <p className="card-text text-muted">
                    Biblioteca completa com técnicas de autocuidado: 
                    respiração, mindfulness, gestão de tempo e mais.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <div className="fs-1 mb-3">🌱</div>
                  <h5 className="card-title fw-bold">Sustentabilidade</h5>
                  <p className="card-text text-muted">
                    Colaboradores saudáveis são mais criativos, produtivos 
                    e leais. Invista no futuro da sua organização.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-light py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Como Funciona</h2>
            <p className="lead text-muted">
              Simples, rápido e eficaz
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-3 text-center">
              <div className="mb-3">
                <div
                  className="rounded-circle gradient-primary text-white d-inline-flex align-items-center justify-content-center"
                  style={{ width: '80px', height: '80px', fontSize: '32px' }}
                >
                  1
                </div>
              </div>
              <h5 className="fw-bold">Check-in Diário</h5>
              <p className="text-muted">
                2 minutos para registrar como você está: humor, energia e carga de trabalho
              </p>
            </div>

            <div className="col-md-3 text-center">
              <div className="mb-3">
                <div
                  className="rounded-circle gradient-primary text-white d-inline-flex align-items-center justify-content-center"
                  style={{ width: '80px', height: '80px', fontSize: '32px' }}
                >
                  2
                </div>
              </div>
              <h5 className="fw-bold">Análise Inteligente</h5>
              <p className="text-muted">
                A IA analisa padrões e identifica sinais de alerta no seu bem-estar
              </p>
            </div>

            <div className="col-md-3 text-center">
              <div className="mb-3">
                <div
                  className="rounded-circle gradient-primary text-white d-inline-flex align-items-center justify-content-center"
                  style={{ width: '80px', height: '80px', fontSize: '32px' }}
                >
                  3
                </div>
              </div>
              <h5 className="fw-bold">Sugestões Personalizadas</h5>
              <p className="text-muted">
                Receba recomendações de autocuidado adaptadas ao seu momento
              </p>
            </div>

            <div className="col-md-3 text-center">
              <div className="mb-3">
                <div
                  className="rounded-circle gradient-primary text-white d-inline-flex align-items-center justify-content-center"
                  style={{ width: '80px', height: '80px', fontSize: '32px' }}
                >
                  4
                </div>
              </div>
              <h5 className="fw-bold">Acompanhamento</h5>
              <p className="text-muted">
                Visualize sua evolução ao longo do tempo e celebre progressos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-4">
                Pronto para transformar seu bem-estar?
              </h2>
              <p className="lead text-muted mb-4">
                Junte-se a organizações que valorizam a saúde mental de seus colaboradores
              </p>
              <Link to="/login" className="btn btn-primary btn-lg px-5">
                Começar Gratuitamente
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
