import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importar páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import Resources from './pages/Resources';
import Support from './pages/Support';
import AdminDashboard from './pages/AdminDashboard';

// Importar componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  // Estado de autenticação (simplificado para o projeto)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mindbalance_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Função de login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('mindbalance_user', JSON.stringify(userData));
  };

  // Função de logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mindbalance_user');
    localStorage.removeItem('mindbalance_token');
  };

  // Componente de rota protegida
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Componente de rota de admin
  const AdminRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (user.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-grow-1">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
              } 
            />

            {/* Rotas protegidas (precisa estar logado) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkin"
              element={
                <ProtectedRoute>
                  <CheckIn user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              }
            />

            {/* Rota de admin */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Rota 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
