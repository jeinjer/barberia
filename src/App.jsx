import React, { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';
import AuthPortal from './components/Auth/Portal/Auth';
import SubscriptionGuard from './components/Auth/Portal/SubscriptionGuard';

function App() {
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchPerfil(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchPerfil(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPerfil = async (userId) => {
    const { data } = await supabase.from('perfiles').select('*').eq('id', userId).single();
    setPerfil(data);
  };

  if (!session) return <AuthPortal />;

  if (perfil && !perfil.barberia_id) {
    return <Onboarding user={session.user} onComplete={() => fetchPerfil(session.user.id)} />;
  }

  return (
    <SubscriptionGuard user={session.user}>
      <Dashboard barberiaId={perfil?.barberia_id} />
    </SubscriptionGuard>
  );
}

export default App;