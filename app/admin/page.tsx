'use client';

import { useState } from 'react';
import { useAuth } from '../components/Auth';
import './admin.css';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { isAuthenticated, isAdmin, isLoading, error: authError, username, login, logout } = useAuth();
  const [inputUsername, setInputUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [localError, setLocalError] = useState('');

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="admin-login-page">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!inputUsername || !password) {
      setLocalError('Por favor ingresa usuario y contraseña');
      return;
    }

    setIsLoggingIn(true);
    const success = await login(inputUsername, password);
    setIsLoggingIn(false);

    if (!success) {
      setPassword('');
    } else {
      setInputUsername('');
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
              <label>Usuario</label>
              <input
                type="text"
                placeholder="Tu nombre de usuario"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                className="input-field"
                disabled={isLoggingIn}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                disabled={isLoggingIn}
                autoComplete="current-password"
              />
            </div>

            {(localError || authError) && (
              <div className="error-message">{localError || authError}</div>
            )}

            <button type="submit" className="btn-login" disabled={isLoggingIn}>
              {isLoggingIn ? 'Iniciando sesión...' : 'Entrar'}
            </button>
          </form>

          <div className="login-help">
            <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
              ¿Necesitas crear una cuenta? Contacta al administrador
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si NO es admin, mostrar acceso denegado
  if (!isAdmin) {
    return (
      <div className="admin-login-page">
        <div className="login-card">
          <div className="logo-container">
            <img src="/LOGO.jpg" alt="GA Stilus Logo" className="login-logo" />
          </div>
          <p className="subtitle">Acceso Denegado</p>
          
          <div style={{ textAlign: 'center', padding: '20px', color: '#a33' }}>
            <p style={{ marginBottom: '20px' }}>
              La cuenta <strong>{username}</strong> no tiene permisos de administrador.
            </p>
            <button onClick={logout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si ESTÁ autenticado Y es admin, mostrar dashboard
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
          <span style={{ marginRight: '20px', fontSize: '14px', color: '#666' }}>
            👤 {username}
          </span>
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
