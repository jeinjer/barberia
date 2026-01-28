import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck, UserPlus } from 'lucide-react';
import { supabase } from '../../../utils/supabase';

export default function AuthPortal() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword(formData);
      if (error) alert(error.message);
    } else {
      // 1. Validar si el email existe en la whitelist de suscripciones
      const { data: suscripcion, error: errorSusc } = await supabase
        .from('suscripciones_saas')
        .select('estado')
        .eq('email', formData.email)
        .single();

      if (errorSusc || !suscripcion) {
        alert("Este email no posee una invitación activa.");
        setLoading(false);
        return;
      }

      // 2. Bloquear si está inactiva
      if (suscripcion.estado === 'Inactiva') {
        alert("Cuenta inhabilitada por falta de pago o baja del servicio.");
        setLoading(false);
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (signUpError) alert(signUpError.message);
      else alert("¡Invitación validada! Revisá tu mail.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      {/* Luces de fondo animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        layout
        className="relative w-full max-w-5xl h-[650px] bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] shadow-2xl flex overflow-hidden z-10"
      >
        {/* Lado Izquierdo: Formulario Dinámico */}
        <div className="flex-1 p-12 flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">
                {isLogin ? 'Bienvenido de nuevo' : 'Registrar Barbería'}
              </h2>
              <p className="text-slate-400 mb-8">
                {isLogin ? 'Ingresá a tu panel central.' : 'Validá tu suscripción mensual.'}
              </p>

              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Corporativo</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="email" 
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="nombre@barberia.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="password" 
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group"
                >
                  {loading ? 'Procesando...' : isLogin ? 'Entrar al Dashboard' : 'Validar Invitación'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="mt-8 text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
              >
                {isLogin ? <><UserPlus size={16}/> ¿Sos cliente nuevo? Registrate</> : <><ArrowLeft size={16}/> Ya tengo cuenta</>}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Lado Derecho: Branding Visual */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-blue-700 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          
          <div className="relative z-10">
            <ShieldCheck size={48} className="text-white mb-6" />
            <h3 className="text-3xl font-black text-white leading-tight tracking-tighter">
              GESTIÓN PROFESIONAL <br /> PARA BARBERÍAS.
            </h3>
          </div>

          <div className="relative z-10">
            <p className="text-indigo-100 text-sm font-medium leading-relaxed">
              Sistema SaaS exclusivo para dueños autorizados. Control de turnos, estadísticas y gestión de staff en un solo lugar.
            </p>
            <div className="mt-6 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-white" />
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="w-2 h-2 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}