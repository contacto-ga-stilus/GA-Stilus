'use client';

import { useState, useEffect } from 'react';

// Componente para proteger rutas del admin
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario ya está autenticado en sessionStorage
    const storedAuth = sessionStorage.getItem('adminAuth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    // Esta es la contraseña del admin (cámbiala por una más segura)
    // En producción, esto debería validarse contra un servidor
    const ADMIN_PASSWORD = 'MiaStilus-010619'; // Cambia esto por tu contraseña

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
