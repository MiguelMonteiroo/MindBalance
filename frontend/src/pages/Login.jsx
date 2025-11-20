import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        onLogin(response.user);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para preencher com usuário de teste
  const fillTestUser = (userType) => {
    if (userType === 'colaborador') {
      setEmail('mariana.silva@empresa.com');
      setPassword('senha123');
    } else if (userType === 'admin') {
      setEmail('carlos.santos@empresa.com');
      setPassword('senha123');
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-gradient">🧠 MindBalance</h2>
                  <p className="text-muted">Entre na sua conta</p>
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError('')}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      placeholder="seu.email@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Senha
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 btn-lg mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </button>
                </form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="text-muted small mb-3">
                    <strong>💡 Usuários de teste:</strong>
                  </p>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => fillTestUser('colaborador')}
                      type="button"
                    >
                      👤 Colaborador (Mariana)
                    </button>
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => fillTestUser('admin')}
                      type="button"
                    >
                      👨‍💼 Admin/RH (Carlos)
                    </button>
                  </div>
                  <p className="text-muted small mt-3 mb-0">
                    Senha para todos: <code>senha123</code>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-white">
                <small>
                  ℹ️ Certifique-se de que o backend está rodando em{' '}
                  <code className="text-white">localhost:5000</code>
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
