import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../services/api';

function Dashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getPersonal(user.id);
      
      if (data.success) {
        setDashboardData(data);
      } else {
        setError('Erro ao carregar dados do dashboard');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  // Preparar dados do gráfico
  const chartData = dashboardData?.chartData?.map(item => ({
    ...item,
    date: formatDate(item.date)
  })) || [];

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3 text-muted">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h5>⚠️ Erro</h5>
          <p>{error}</p>
          <button className="btn btn-sm btn-danger" onClick={loadDashboardData}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const { weekSummary, insights } = dashboardData || {};

  // Função para emoji do trend
  const getTrendEmoji = (trend) => {
    if (trend === 'improving') return '📈';
    if (trend === 'declining') return '📉';
    return '➡️';
  };

  // Função para cor do trend
  const getTrendColor = (trend) => {
    if (trend === 'improving') return 'success';
    if (trend === 'declining') return 'danger';
    return 'secondary';
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="gradient-primary text-white py-4 mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="mb-1">Olá, {user?.name?.split(' ')[0]}! 👋</h2>
              <p className="mb-0 opacity-75">Como você está hoje?</p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <Link to="/checkin" className="btn btn-light btn-lg">
                <i className="bi bi-clipboard-check me-2"></i>
                Fazer Check-in
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        {/* Cards de Resumo */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-muted small mb-2">Humor Médio</div>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <h2 className="mb-0 me-2">{weekSummary?.avgMood?.toFixed(1) || '0.0'}</h2>
                  <span className="fs-3">
                    {weekSummary?.avgMood >= 4 ? '😊' : weekSummary?.avgMood >= 3 ? '😐' : '😕'}
                  </span>
                </div>
                <small className="text-muted">Esta semana</small>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-muted small mb-2">Energia Média</div>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <h2 className="mb-0 me-2">{weekSummary?.avgEnergy?.toFixed(1) || '0.0'}</h2>
                  <span className="fs-3">
                    {weekSummary?.avgEnergy >= 4 ? '⚡' : weekSummary?.avgEnergy >= 3 ? '🔋' : '🪫'}
                  </span>
                </div>
                <small className="text-muted">Esta semana</small>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-muted small mb-2">Check-ins</div>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <h2 className="mb-0 me-2">{weekSummary?.checkinsCompleted || 0}</h2>
                  <span className="fs-3">✓</span>
                </div>
                <small className="text-muted">Últimos 7 dias</small>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-muted small mb-2">Tendência</div>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <span className="fs-1">{getTrendEmoji(weekSummary?.trend)}</span>
                </div>
                <small className={`badge bg-${getTrendColor(weekSummary?.trend)}`}>
                  {weekSummary?.trend === 'improving' ? 'Melhorando' : 
                   weekSummary?.trend === 'declining' ? 'Atenção' : 'Estável'}
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Evolução */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">📊 Sua Evolução</h5>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="#667eea" 
                        strokeWidth={2}
                        name="Humor"
                        dot={{ fill: '#667eea', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="energy" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Energia"
                        dot={{ fill: '#10b981', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted py-5">
                    <p>Ainda não há dados suficientes para exibir o gráfico.</p>
                    <p>Faça seu primeiro check-in para começar a acompanhar sua evolução!</p>
                    <Link to="/checkin" className="btn btn-primary mt-3">
                      Fazer Check-in Agora
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Insights da IA */}
        {insights && insights.length > 0 && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">🤖 Insights Personalizados</h5>
                  {insights.map((insight, index) => (
                    <div key={index} className="alert alert-info d-flex align-items-start mb-3">
                      <i className="bi bi-lightbulb fs-4 me-3"></i>
                      <div className="flex-grow-1">
                        <p className="mb-0">{insight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">📝 Check-in Diário</h5>
                <p className="text-muted">
                  Registre como você está se sentindo hoje. Leva apenas 2 minutos!
                </p>
                <Link to="/checkin" className="btn btn-primary">
                  Fazer Check-in
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">📚 Recursos de Bem-estar</h5>
                <p className="text-muted">
                  Explore técnicas de autocuidado, mindfulness e gestão de estresse.
                </p>
                <Link to="/resources" className="btn btn-outline-primary">
                  Ver Recursos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
