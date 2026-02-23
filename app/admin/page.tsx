'use client';

import { useState } from 'react';
import { useAuth } from '../components/Auth';
import './admin.css';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="admin-login-page">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Por favor ingresa la contraseña');
      return;
    }

    if (login(password)) {
      setPassword('');
      // La página se actualizará automáticamente porque isAuthenticated cambió
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
  };

  // Si NO está autenticado, mostrar formulario de login
  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="login-card">
          <div className="logo-container">
            <img src="/LOGO.jpg" alt="GA Stilus Logo" className="login-logo" />
          </div>
          <p className="subtitle">Panel de Administración</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Contraseña de administrador</label>
              <input
                type="password"
                placeholder="Ingresa la contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-login">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Si ESTÁ autenticado, mostrar dashboard
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <img src="/LOGO.jpg" alt="GA Stilus Logo" className="header-logo" />
          <div>
            <h1>GA Stilus — Admin</h1>
            <p>Gestión de contenido del sitio</p>
          </div>
        </div>
        <div className="header-right">
          <a href="/" className="btn-ver-sitio">← Ver sitio</a>
          <button onClick={logout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Bienvenido al Panel de Administración</h2>
          <p>Aquí puedes gestionar el contenido del sitio web.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>💼 Gestionar Catálogo de Caballero</h3>
            <p>Administra los productos y categorías de caballeros</p>
            <button className="btn-action"
            onClick={() => router.push('/admin/caballero')}>Ir al catálogo</button>
          </div>

          <div className="dashboard-card">
            <h3>📦 Gestionar Catálogo de Dama</h3>
            <p>Administra los productos y categorías de damas</p>
            <button className="btn-action"
            /*onClick={() => router.push('/admin/dama')}*/>Ir al catálogo</button>
          </div>
        </div>
      </main>
    </div>
  );
}
