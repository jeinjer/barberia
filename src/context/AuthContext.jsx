import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check sesión inicial
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) await fetchPerfil(session.user.id);
      else setLoading(false);
    };
    initAuth();

    // 2. Escuchar cambios
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) await fetchPerfil(session.user.id);
      else {
        setPerfil(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPerfil = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error) setPerfil(data);
    } catch (error) {
      console.error('Error rol:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    perfil,
    loading,
    isAdmin: perfil?.rol === 'superadmin',
    // Helpers para limpiar código en otros lados
    logout: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};