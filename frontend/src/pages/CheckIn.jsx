import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkinService } from '../services/api';

function CheckIn({ user }) {
  const navigate = useNavigate();
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [workload, setWorkload] = useState('adequada');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  // Emojis para mood
  const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];
  const moodLabels = ['Muito mal', 'Mal', 'Ok', 'Bem', 'Muito bem'];

  // Emojis para energy
  const energyEmojis = ['🪫', '🔋', '🔋🔋', '⚡', '⚡⚡'];
  const energyLabels = ['Exausto', 'Cansado', 'Normal', 'Energizado', 'Muito energizado'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const checkinData = {
        userId: user.id,
        mood: parseInt(mood),
        energy: parseInt(energy),
        workload,
        comment
      };

      const result = await checkinService.create(checkinData);

      if (result.success) {
        setResponse(result.checkin);
        // Limpar formulário após 3 segundos e redirecionar
        setTimeout(() => {
          navigate('/dashboard');
        }, 4000);
      } else {
        setError(result.message || 'Erro ao registrar check-in');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Se já enviou, mostra resultado
  if (response) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-0 shadow-lg">
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <div className="display-1">✅</div>
                  <h2 className="mt-3">Check-in Registrado!</h2>
                  <p className="text-muted">Obrigado por compartilhar como você está.</p>
                </div>

                {/* Sugestão da IA */}
                <div className="alert alert-info text-start">
                  <div className="d-flex align-items-start">
                    <span className="fs-3 me-3">🤖</span>
                    <div>
                      <strong>Sugestão da IA:</strong>
                      <p className="mb-0 mt-2">{response.aiSuggestion}</p>
                    </div>
                  </div>
                </div>

                {/* Recursos recomendados */}
                {response.recommendedResources && response.recommendedResources.length > 0 && (
                  <div className="mt-4">
                    <h6 className="text-start">📚 Recursos Recomendados:</h6>
                    <div className="d-flex gap-2 flex-wrap justify-content-center">
                      {response.recommendedResources.map((resourceId, index) => (
                        <span key={index} className="badge bg-primary">
                          Recurso #{resourceId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ações sugeridas */}
                {response.suggestedActions && response.suggestedActions.length > 0 && (
                  <div className="mt-4 text-start">
                    <h6>💡 Ações Sugeridas:</h6>
                    <ul className="list-unstyled">
                      {response.suggestedActions.slice(0, 3).map((action, index) => (
                        <li key={index} className="mb-2">
                          <i className="bi bi-check-circle text-success me-2"></i>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-muted small">Redirecionando para o dashboard...</p>
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkin-page">
      {/* Header */}
      <div className="gradient-primary text-white py-4 mb-4">
        <div className="container">
          <h2 className="mb-1">📝 Check-in Diário</h2>
          <p className="mb-0 opacity-75">Como você está se sentindo hoje?</p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
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

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  {/* Mood Slider */}
                  <div className="mb-5">
                    <label className="form-label fw-bold">
                      1. Como está seu humor agora?
                    </label>
                    <div className="text-center mb-3">
                      <span className="display-1">{moodEmojis[mood - 1]}</span>
                      <p className="text-muted mt-2">{moodLabels[mood - 1]}</p>
                    </div>
                    <input
                      type="range"
                      className="form-range"
                      min="1"
                      max="5"
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      style={{ height: '10px' }}
                    />
                    <div className="d-flex justify-content-between mt-2">
                      {moodEmojis.map((emoji, index) => (
                        <span 
                          key={index}
                          style={{ 
                            fontSize: '1.5rem', 
                            opacity: mood == index + 1 ? 1 : 0.3,
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                          onClick={() => setMood(index + 1)}
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Energy Slider */}
                  <div className="mb-5">
                    <label className="form-label fw-bold">
                      2. Como está seu nível de energia?
                    </label>
                    <div className="text-center mb-3">
                      <span className="display-1">{energyEmojis[energy - 1]}</span>
                      <p className="text-muted mt-2">{energyLabels[energy - 1]}</p>
                    </div>
                    <input
                      type="range"
                      className="form-range"
                      min="1"
                      max="5"
                      value={energy}
                      onChange={(e) => setEnergy(e.target.value)}
                      style={{ height: '10px' }}
                    />
                    <div className="d-flex justify-content-between mt-2">
                      {energyEmojis.map((emoji, index) => (
                        <span 
                          key={index}
                          style={{ 
                            fontSize: '1.5rem', 
                            opacity: energy == index + 1 ? 1 : 0.3,
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                          onClick={() => setEnergy(index + 1)}
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Workload Radio */}
                  <div className="mb-5">
                    <label className="form-label fw-bold">
                      3. Como está sua carga de trabalho?
                    </label>
                    <div className="mt-3">
                      <div className="form-check mb-3 p-3 border rounded" 
                           style={{ 
                             backgroundColor: workload === 'leve' ? '#f0f9ff' : 'white',
                             cursor: 'pointer'
                           }}
                           onClick={() => setWorkload('leve')}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="workload"
                          id="workloadLeve"
                          value="leve"
                          checked={workload === 'leve'}
                          onChange={(e) => setWorkload(e.target.value)}
                        />
                        <label className="form-check-label ms-2" htmlFor="workloadLeve" style={{ cursor: 'pointer' }}>
                          <strong>😌 Leve</strong> - Estou confortável com as demandas
                        </label>
                      </div>

                      <div className="form-check mb-3 p-3 border rounded" 
                           style={{ 
                             backgroundColor: workload === 'adequada' ? '#f0f9ff' : 'white',
                             cursor: 'pointer'
                           }}
                           onClick={() => setWorkload('adequada')}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="workload"
                          id="workloadAdequada"
                          value="adequada"
                          checked={workload === 'adequada'}
                          onChange={(e) => setWorkload(e.target.value)}
                        />
                        <label className="form-check-label ms-2" htmlFor="workloadAdequada" style={{ cursor: 'pointer' }}>
                          <strong>👌 Adequada</strong> - Estou no limite saudável
                        </label>
                      </div>

                      <div className="form-check mb-3 p-3 border rounded" 
                           style={{ 
                             backgroundColor: workload === 'pesada' ? '#fef3c7' : 'white',
                             cursor: 'pointer'
                           }}
                           onClick={() => setWorkload('pesada')}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="workload"
                          id="workloadPesada"
                          value="pesada"
                          checked={workload === 'pesada'}
                          onChange={(e) => setWorkload(e.target.value)}
                        />
                        <label className="form-check-label ms-2" htmlFor="workloadPesada" style={{ cursor: 'pointer' }}>
                          <strong>😓 Pesada</strong> - Estou sobrecarregado(a)
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      4. Quer compartilhar algo? <span className="text-muted fw-normal">(opcional)</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Ex: Hoje tive muitas reuniões, estou um pouco cansado..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength="500"
                    ></textarea>
                    <small className="text-muted">
                      <i className="bi bi-lock me-1"></i>
                      Seus dados são privados e protegidos
                    </small>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Enviar Check-in
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Info Card */}
            <div className="card border-0 bg-light mt-4">
              <div className="card-body">
                <h6 className="card-title">💡 Por que fazer check-in?</h6>
                <ul className="small mb-0">
                  <li>Acompanhe sua evolução ao longo do tempo</li>
                  <li>Receba sugestões personalizadas da IA</li>
                  <li>Identifique padrões no seu bem-estar</li>
                  <li>Ajude sua empresa a criar um ambiente melhor</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckIn;
