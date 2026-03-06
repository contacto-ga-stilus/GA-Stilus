'use client';

import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

// Hook para proteger rutas del admin con usuario + contraseña
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        setIsAuthenticated(true);
        
        // Obtener datos del usuario desde Firestore
        try {
          const userDoc = await getDoc(doc(db, 'admin_users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUsername(userData.username || '');
            setIsAdmin(userData.admin === true);
          }
        } catch (err) {
          console.error('Error obteniendo datos del usuario:', err);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUsername('');
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (inputUsername: string, password: string): Promise<boolean> => {
    try {
      setError('');
      
      // Validar entrada
      if (!inputUsername || !password) {
        setError('Usuario y contraseña son requeridos');
        return false;
      }

      // Generar email oculto basado en el username
      const hiddenEmail = `${inputUsername.toLowerCase()}@ga-stilus.local`;

      // Intentar login con Firebase
      await signInWithEmailAndPassword(auth, hiddenEmail, password);
      
      // El estado se actualizará automáticamente por el onAuthStateChanged
      return true;
    } catch (err: any) {
      let errorMessage = 'Error al iniciar sesión';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Datos inválidos';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos. Intenta más tarde';
      }
      
      setError(errorMessage);
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
      // El estado se actualizará automáticamente por el onAuthStateChanged
    } catch (err: any) {
      setError('Error al cerrar sesión');
      console.error('Logout error:', err);
    }
  };

  const refreshToken = async () => {
    if (user) {
      try {
        await user.getIdToken(true);
        // Refrescar datos del usuario
        const userDoc = await getDoc(doc(db, 'admin_users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.admin === true);
        }
      } catch (err) {
        console.error('Error refrescando datos:', err);
      }
    }
  };

  return {
    user,
    username,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
  };
}
