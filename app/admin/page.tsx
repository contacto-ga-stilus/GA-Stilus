'use client'; 

import { useState } from 'react';
import { useAuth } from '../components/Auth';//Hook personalizado que maneja la autenticación (login, logout, estado del usuario, etc.)
import './admin.css';
import { useRouter } from 'next/navigation';
export default function AdminPage() {
  // Se obtienen valores y funciones del contexto de autenticación
  const { 
    isAuthenticated, // indica si el usuario está autenticado
    isAdmin,         // indica si el usuario tiene permisos de administrador
    isLoading,       // indica si la autenticación aún se está verificando
    error: authError,// error que pueda venir del sistema de autenticación
    username,        // nombre del usuario autenticado
    login,           // función para iniciar sesión
    logout           // función para cerrar sesión
  } = useAuth();
  // Estados para manejar los inputs del formulario
  const [inputUsername, setInputUsername] = useState('');
  const [password, setPassword] = useState('');
  // Estado para mostrar loading mientras se intenta hacer login
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Error local del formulario (por ejemplo campos vacíos)
  const [localError, setLocalError] = useState('');
  // Router de Next.js para cambiar de página
  const router = useRouter();
  // Si el sistema de autenticación aún está cargando
  if (isLoading) {
    return (
      <div className="admin-login-page">
        <div className="loading">Cargando...</div>
      </div>
    );
  }
  // Función que se ejecuta cuando se envía el formulario de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // evita que el formulario recargue la página
    setLocalError('');  // limpia errores previos
    // Validación simple: verificar que ambos campos estén llenos
    if (!inputUsername || !password) {
      setLocalError('Por favor ingresa usuario y contraseña');
      return;
    }
    // Activa estado de "iniciando sesión"
    setIsLoggingIn(true);
    // Llama a la función login del contexto de autenticación
    const success = await login(inputUsername, password);
    // Desactiva estado de login
    setIsLoggingIn(false);
    // Si el login falla se limpia solo la contraseña
    if (!success) {
      setPassword('');
    } else {
      // Si el login es exitoso se limpian ambos campos
      setInputUsername('');
      setPassword('');
    }
  };
  // SI EL USUARIO NO ESTÁ LOGUEADO
  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="login-card">
          {/* Logo del sitio */}
          <div className="logo-container">
            <img src="/LOGO.jpg" alt="GA Stilus Logo" className="login-logo" />
          </div>
          <p className="subtitle">Panel de Administración</p>
          {/* Formulario de Login */}
          <form onSubmit={handleLogin} className="login-form">
            {/* Campo usuario */}
            <div className="form-group">
              <label>Usuario</label>
              <input
                type="text"
                placeholder="Tu nombre de usuario"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                className="input-field"
                disabled={isLoggingIn} // desactiva mientras se hace login
                autoComplete="username"
              />
            </div>
            {/* Campo contraseña */}
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
            {/* Mensaje de error */}
            {(localError || authError) && (
              <div className="error-message">{localError || authError}</div>
            )}
            {/* Botón de login */}
            <button type="submit" className="btn-login" disabled={isLoggingIn}>
              {isLoggingIn ? 'Iniciando sesión...' : 'Entrar'}
            </button>
          </form>
          {/* Texto informativo */}
          <div className="login-help">
            <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
              ¿Necesitas crear una cuenta? Contacta al administrador
            </p>
          </div>
        </div>
      </div>
    );
  }  
  // SI EL USUARIO NO ES ADMIN
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
            {/* Permite cerrar sesión */}
            <button onClick={logout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }
  // USUARIO AUTENTICADO Y ADMIN
  return (
    <div className="admin-dashboard">
      {/* Header del panel */}
      <header className="admin-header">
        <div className="header-left">
          <img src="/LOGO.jpg" alt="GA Stilus Logo" className="header-logo" />
          <div>
            <h1>GA Stilus — Admin</h1>
            <p>Gestión de contenido del sitio</p>
          </div>
        </div>
        {/* Información del usuario */}
        <div className="header-right">
          <span style={{ marginRight: '20px', fontSize: '14px', color: '#666' }}>
            👤 {username}
          </span>
          {/* Botón para volver al sitio público */}
          <a href="/" className="btn-ver-sitio">← Ver sitio</a>
          {/* Cerrar sesión */}
          <button onClick={logout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </header>
      {/* Contenido principal del dashboard */}
      <main className="dashboard-content">
        {/* Mensaje de bienvenida */}
        <div className="welcome-section">
          <h2>Bienvenido al Panel de Administración</h2>
          <p>Aquí puedes gestionar el contenido del sitio web.</p>
        </div>
        {/* Tarjetas de navegación */}
        <div className="dashboard-grid">
          {/* Gestión catálogo caballero */}
          <div className="dashboard-card">
            <h3>💼 Gestionar Catálogo de Caballero</h3>
            <p>Administra los productos y categorías de caballeros</p>
            <button
              className="btn-action"
              onClick={() => router.push('/admin/caballero')}
            >
              Ir al catálogo
            </button>
          </div>
          {/* Gestión catálogo dama */}
          <div className="dashboard-card">
            <h3>📦 Gestionar Catálogo de Dama</h3>
            <p>Administra los productos y categorías de damas</p>
            <button
              className="btn-action"
              /*onClick={() => router.push('/admin/dama')}*/
            >
              Ir al catálogo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}