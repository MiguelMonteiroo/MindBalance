import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../services/api';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [error, setError] = useState('');

  useEffect(() => {
    loadAdminData();
  }, [selectedDepartment, selectedPeriod]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardService.getAdmin(selectedDepartment, selectedPeriod);
      
      if (data.success) {
        setDashboardData(data);
      } else {
        setError('Erro ao carregar dados administrativos');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cores para o gráfico de pizza
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  // Dados para gráfico de pizza de carga de trabalho
  const workloadChartData = dashboardData?.workloadDistribution ? [
    { name: 'Leve', value: dashboardData.workloadDistribution.leve || 0 },
    { name: 'Adequada', value: dashboardData.workloadDistribution.adequada || 0 },
    { name: 'Pesada', value: dashboardData.workloadDistribution.pesada || 0 }
  ] : [];

  // Função para cor da severidade
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      default: return 'info';
    }
  };

  // Função para ícone da severidade
  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      default: return '🔵';
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3 text-muted">Carregando dashboard administrativo...</p>
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
          <button className="btn btn-sm btn-danger" onClick={loadAdminData}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      {/* Header */}
      <div className="gradient-primary text-white py-4 mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <h2 className="mb-0 me-3">👨‍💼 Dashboard Administrativo</h2>
                <span className="badge bg-light text-primary">Admin</span>
              </div>
              <p className="mb-0 opacity-75 mt-2">Visão geral do bem-estar organizacional</p>
            </div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <select
                className="form-select form-select-sm d-inline-block w-auto me-2"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="week">Última semana</option>
                <option value="month">Último mês</option>
              </select>
              <select
                className="form-select form-select-sm d-inline-block w-auto"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">Todos os departamentos</option>
                <option value="Marketing">Marketing</option>
                <option value="TI">TI</option>
                <option value="RH">RH</option>
                <option value="Vendas">Vendas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        {/* KPIs Principais */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-muted small mb-2">Bem-estar Geral</div>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <h2 className="mb-0 me-2 text-primary">
                    {dashboardData?.overallWellbeing?.toFixed(1) || '0.0'}
                  </h2>
                  <span className="fs-3">
                    {dashboardData?.overallWellbeing >= 4 ? '😊' : 
                     dashboardData?.overallWellbeing >= 3 ? '😐' : '😕'}
                  </span>
                </div>
                <small className="text-success">
                  {dashboardData?.trends?.trend === 'improving' ? '↗ Melhorando' : 
                   dashboardData?.trends?.trend === 'declining' ? '↘ Atenção' : '→ Estável'}
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-muted small mb-2">Taxa de Participação</div>
                <div className="mb-2">
                  <h2 className="mb-0 text-primary">
                    {dashboardData?.participationRate?.toFixed(0) || '0'}%
                  </h2>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${dashboardData?.participationRate || 0}%` }}
                  ></div>
                </div>
                <small className="text-muted mt-2 d-block">Check-ins realizados</small>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-muted small mb-2">Alertas Ativos</div>
                <div className="mb-2">
                  <h2 className="mb-0" style={{ 
                    color: (dashboardData?.alerts?.length || 0) > 0 ? '#f59e0b' : '#10b981' 
                  }}>
                    {dashboardData?.alerts?.length || 0}
                  </h2>
                </div>
                <small className="text-muted">
                  {(dashboardData?.alerts?.length || 0) > 0 ? 'Equipes precisam de atenção' : 'Tudo sob controle'}
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-muted small mb-2">Tendência Geral</div>
                <div className="mb-2">
                  <h2 className="mb-0">
                    {dashboardData?.trends?.trend === 'improving' ? '📈' : 
                     dashboardData?.trends?.trend === 'declining' ? '📉' : '➡️'}
                  </h2>
                </div>
                <small className={`badge bg-${
                  dashboardData?.trends?.trend === 'improving' ? 'success' : 
                  dashboardData?.trends?.trend === 'declining' ? 'danger' : 'secondary'
                }`}>
                  {dashboardData?.trends?.trend === 'improving' ? 'Melhorando' : 
                   dashboardData?.trends?.trend === 'declining' ? 'Atenção Necessária' : 'Estável'}
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">⚠️ Alertas e Ações Recomendadas</h5>
                  {dashboardData.alerts.map((alert, index) => (
                    <div key={index} className={`alert alert-${getSeverityColor(alert.severity)} d-flex align-items-start mb-3`}>
                      <span className="fs-4 me-3">{getSeverityIcon(alert.severity)}</span>
                      <div className="flex-grow-1">
                        <strong>{alert.team}</strong>
                        <p className="mb-2">{alert.reason}</p>
                        <button className="btn btn-sm btn-outline-dark me-2">
                          <i className="bi bi-eye me-1"></i>
                          Ver Detalhes
                        </button>
                        <button className="btn btn-sm btn-outline-dark">
                          <i className="bi bi-check-circle me-1"></i>
                          Marcar como Resolvido
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gráficos */}
        <div className="row mb-4">
          {/* Distribuição de Carga de Trabalho */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-4">📊 Distribuição de Carga de Trabalho</h5>
                {workloadChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={workloadChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {workloadChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted py-5">
                    <p>Dados insuficientes para exibir o gráfico</p>
                  </div>
                )}
                <div className="mt-3">
                  <div className="d-flex justify-content-around text-center">
                    <div>
                      <div className="badge bg-success mb-1">Leve</div>
                      <div className="fw-bold">{dashboardData?.workloadDistribution?.leve || 0}%</div>
                    </div>
                    <div>
                      <div className="badge bg-primary mb-1">Adequada</div>
                      <div className="fw-bold">{dashboardData?.workloadDistribution?.adequada || 0}%</div>
                    </div>
                    <div>
                      <div className="badge bg-warning mb-1">Pesada</div>
                      <div className="fw-bold">{dashboardData?.workloadDistribution?.pesada || 0}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas Gerais */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-4">📈 Estatísticas da Semana</h5>
                <div className="row">
                  <div className="col-6 mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="text-muted small">Humor Médio</div>
                      <h4 className="mb-0 text-primary">{dashboardData?.trends?.avgMood?.toFixed(1) || '0.0'}</h4>
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="text-muted small">Energia Média</div>
                      <h4 className="mb-0 text-success">{dashboardData?.trends?.avgEnergy?.toFixed(1) || '0.0'}</h4>
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="text-muted small">Check-ins</div>
                      <h4 className="mb-0 text-info">{dashboardData?.trends?.checkinsCompleted || 0}</h4>
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="text-muted small">Colaboradores</div>
                      <h4 className="mb-0 text-warning">
                        {Math.round((dashboardData?.participationRate || 0) / 25) || 4}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h6 className="mb-3">💡 Insights Principais</h6>
                  <ul className="list-unstyled small">
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      {dashboardData?.participationRate >= 70 ? 
                        'Boa taxa de participação nos check-ins' : 
                        'Considere incentivar mais check-ins'}
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      {dashboardData?.workloadDistribution?.pesada < 20 ?
                        'Carga de trabalho bem distribuída' :
                        'Muitos colaboradores com carga pesada'}
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      {dashboardData?.overallWellbeing >= 3.5 ?
                        'Bem-estar geral acima da média' :
                        'Atenção ao bem-estar da equipe'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title">📄 Gerar Relatório</h6>
                <p className="small text-muted">
                  Exporte dados completos do período selecionado
                </p>
                <button className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-download me-2"></i>
                  Baixar PDF
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title">📚 Playbook de Ações</h6>
                <p className="small text-muted">
                  Estratégias para melhorar o clima organizacional
                </p>
                <button className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-book me-2"></i>
                  Acessar Playbook
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title">📧 Comunicar Equipe</h6>
                <p className="small text-muted">
                  Envie mensagens sobre bem-estar para os colaboradores
                </p>
                <button className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-envelope me-2"></i>
                  Enviar Comunicado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
