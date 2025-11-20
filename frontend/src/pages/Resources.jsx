import React, { useState, useEffect } from 'react';
import { resourcesService } from '../services/api';

function Resources() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    loadResources();
  }, [selectedCategory]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await resourcesService.getAll(selectedCategory);
      
      if (data.success) {
        setResources(data.resources);
        if (data.categories) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar recursos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por busca
  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Ícone por tipo
  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return '🎥';
      case 'audio': return '🎧';
      case 'article': return '📄';
      default: return '📚';
    }
  };

  // Badge de dificuldade
  const getDifficultyBadge = (difficulty) => {
    const colors = {
      'Fácil': 'success',
      'Intermediário': 'warning',
      'Avançado': 'danger'
    };
    return colors[difficulty] || 'secondary';
  };

  // Se um recurso está selecionado, mostra os detalhes
  if (selectedResource) {
    return (
      <div className="resource-detail-page">
        <div className="gradient-primary text-white py-4 mb-4">
          <div className="container">
            <button 
              className="btn btn-light btn-sm mb-3"
              onClick={() => setSelectedResource(null)}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Voltar
            </button>
            <h2 className="mb-1">{selectedResource.title}</h2>
            <p className="mb-0 opacity-75">{selectedResource.category}</p>
          </div>
        </div>

        <div className="container pb-5">
          <div className="row">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-4">
                    <span className="fs-1 me-3">{getTypeIcon(selectedResource.type)}</span>
                    <div>
                      <h4 className="mb-1">{selectedResource.title}</h4>
                      <div className="d-flex gap-2 flex-wrap">
                        <span className={`badge bg-${getDifficultyBadge(selectedResource.difficulty)}`}>
                          {selectedResource.difficulty}
                        </span>
                        <span className="badge bg-secondary">
                          <i className="bi bi-clock me-1"></i>
                          {selectedResource.duration}
                        </span>
                        <span className="badge bg-info">
                          <i className="bi bi-star-fill me-1"></i>
                          {selectedResource.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="lead">{selectedResource.description}</p>

                  <hr />

                  <div className="content-area">
                    {selectedResource.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-3">{paragraph}</p>
                    ))}
                  </div>

                  <hr />

                  <div className="d-flex gap-2 flex-wrap">
                    {selectedResource.tags.map((tag, index) => (
                      <span key={index} className="badge bg-light text-dark">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h6 className="card-title">📊 Estatísticas</h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <i className="bi bi-eye text-primary me-2"></i>
                      {selectedResource.views} visualizações
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-star-fill text-warning me-2"></i>
                      {selectedResource.rating} avaliação
                    </li>
                    <li>
                      <i className="bi bi-clock text-success me-2"></i>
                      {selectedResource.duration}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">💡 Dica</h6>
                  <p className="small text-muted mb-0">
                    Para aproveitar melhor este recurso, reserve um momento tranquilo 
                    e coloque em prática o que aprender!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resources-page">
      {/* Header */}
      <div className="gradient-primary text-white py-4 mb-4">
        <div className="container">
          <h2 className="mb-1">📚 Biblioteca de Recursos</h2>
          <p className="mb-0 opacity-75">Ferramentas e técnicas para seu bem-estar</p>
        </div>
      </div>

      <div className="container pb-5">
        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-8 mb-3">
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar recursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <select
              className="form-select form-select-lg"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">Todas as categorias</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Badges */}
        <div className="mb-4">
          <button
            className={`btn ${!selectedCategory ? 'btn-primary' : 'btn-outline-primary'} btn-sm me-2 mb-2`}
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </button>
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'} btn-sm me-2 mb-2`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        )}

        {/* Resources Grid */}
        {!loading && (
          <>
            {filteredResources.length === 0 ? (
              <div className="text-center py-5">
                <div className="fs-1 mb-3">🔍</div>
                <h5>Nenhum recurso encontrado</h5>
                <p className="text-muted">Tente buscar com outros termos ou categorias</p>
              </div>
            ) : (
              <div className="row">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="col-md-6 col-lg-4 mb-4">
                    <div 
                      className="card h-100 border-0 shadow-sm hover-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedResource(resource)}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <span className="fs-2">{getTypeIcon(resource.type)}</span>
                          <span className={`badge bg-${getDifficultyBadge(resource.difficulty)}`}>
                            {resource.difficulty}
                          </span>
                        </div>
                        
                        <h5 className="card-title">{resource.title}</h5>
                        <p className="card-text text-muted small">{resource.description}</p>
                        
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <span className="badge bg-light text-dark">
                            <i className="bi bi-clock me-1"></i>
                            {resource.duration}
                          </span>
                          <span className="text-warning">
                            <i className="bi bi-star-fill me-1"></i>
                            {resource.rating}
                          </span>
                        </div>

                        <div className="mt-3">
                          {resource.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="badge bg-light text-dark me-1">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Info Card */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card bg-light border-0">
              <div className="card-body">
                <h5 className="card-title">💡 Dica para aproveitar melhor</h5>
                <p className="mb-0">
                  Escolha um recurso por dia e pratique regularmente. Pequenas ações diárias 
                  trazem grandes resultados no seu bem-estar!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
}

export default Resources;
