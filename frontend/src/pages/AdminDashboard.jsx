import React from 'react';

function AdminDashboard() {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>👨‍💼 Dashboard Administrativo</h2>
            <span className="badge bg-success">Admin</span>
          </div>
          
          <div className="alert alert-info">
            <strong>Página em desenvolvimento!</strong>
            <p className="mb-0">
              Dashboard com visão geral da organização, alertas de equipes em risco e relatórios.
            </p>
          </div>
          
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="card text-center">
                <div className="card-body">
                  <h6 className="text-muted">Bem-estar Geral</h6>
                  <h2 className="text-primary">3.4</h2>
                  <small className="text-success">↗ +5%</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card text-center">
                <div className="card-body">
                  <h6 className="text-muted">Participação</h6>
                  <h2 className="text-primary">78%</h2>
                  <small className="text-muted">Esta semana</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card text-center">
                <div className="card-body">
                  <h6 className="text-muted">Alertas</h6>
                  <h2 className="text-warning">2</h2>
                  <small className="text-muted">Equipes em risco</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card text-center">
                <div className="card-body">
                  <h6 className="text-muted">Tendência</h6>
                  <h2 className="text-success">📈</h2>
                  <small className="text-success">Melhorando</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <p className="text-muted text-center mb-0">
                <em>Gráficos e estatísticas detalhadas em breve...</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
