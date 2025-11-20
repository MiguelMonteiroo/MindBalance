import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <span className="text-gradient">🧠 MindBalance</span>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {!user ? (
              // Menu para visitantes (não logados)
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <button className="btn btn-primary btn-sm px-4">
                      Entrar
                    </button>
                  </Link>
                </li>
              </>
            ) : (
              // Menu para usuários logados
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    <i className="bi bi-speedometer2"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/checkin">
                    <i className="bi bi-clipboard-check"></i> Check-in
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/resources">
                    <i className="bi bi-book"></i> Recursos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/support">
                    <i className="bi bi-life-preserver"></i> Suporte
                  </Link>
                </li>
                
                {/* Mostrar menu admin apenas para admins */}
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      <i className="bi bi-gear"></i> Admin
                    </Link>
                  </li>
                )}
                
                {/* Dropdown de perfil */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                        style={{ width: '35px', height: '35px', fontSize: '14px' }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="d-none d-md-inline">{user.name.split(' ')[0]}</span>
                    </div>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li>
                      <span className="dropdown-item-text">
                        <small className="text-muted">{user.email}</small>
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <span className="dropdown-item-text">
                        <small className="text-muted">
                          <i className="bi bi-briefcase"></i> {user.department}
                        </small>
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Sair
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
