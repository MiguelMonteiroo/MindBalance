import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-top mt-5">
      <div className="container py-4">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 className="text-gradient fw-bold">🧠 MindBalance</h5>
            <p className="text-muted small">
              Cuidar de quem cuida do futuro. <br />
              Plataforma de bem-estar no trabalho.
            </p>
          </div>
          
          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="fw-bold mb-3">Links Rápidos</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none small">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/resources" className="text-muted text-decoration-none small">
                  Recursos
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/support" className="text-muted text-decoration-none small">
                  Suporte
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h6 className="fw-bold mb-3">Sobre o Projeto</h6>
            <p className="text-muted small">
              Projeto acadêmico desenvolvido para a disciplina de 
              Futuro do Trabalho, Inovação e Tecnologia.
            </p>
            <p className="text-muted small mb-0">
              <i className="bi bi-heart-fill text-danger"></i> Feito com dedicação
            </p>
          </div>
        </div>
        
        <hr className="my-3" />
        
        <div className="row">
          <div className="col-12 text-center">
            <p className="text-muted small mb-0">
              © {currentYear} MindBalance. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
