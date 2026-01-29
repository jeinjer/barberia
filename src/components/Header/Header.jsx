import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, LogOut, LayoutGrid, Sun, Moon, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const { session, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Array de rutas donde NO queremos mostrar navegación de login/registro
  const hideNavRoutes = ['/login', '/registro', '/forgot-password', '/reset-password'];
  const isAuthPage = hideNavRoutes.includes(location.pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#050507]/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* BRANDING: TOMMASYS */}
        <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tighter text-slate-900 dark:text-white group">
          <div className="relative p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 group-hover:border-cyan-500/50 transition-all overflow-hidden">
            <div className="absolute inset-0 bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
            <Zap className="relative text-cyan-600 dark:text-cyan-400 fill-cyan-600 dark:fill-cyan-400" size={18} />
          </div>
          <span>TOMMA<span className="text-cyan-600 dark:text-cyan-400">SYS</span></span>
        </Link>

        <div className="flex items-center gap-4">
          
          {/* Botón Switch Tema */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Separador (solo si no es página de auth) */}
          {!isAuthPage && <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10 hidden sm:block"></div>}

          {/* Navegación */}
          <nav className="flex items-center gap-3">
            {session ? (
              <>
                <Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white transition-colors">
                  <LayoutGrid size={14} /> Panel
                </Link>

                {isAdmin && (
                  <Link to="/admin" className="hidden md:flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-indigo-100 dark:hover:bg-indigo-500 hover:text-indigo-700 dark:hover:text-white transition-all">
                    <Sparkles size={10} /> God Mode
                  </Link>
                )}
                
                <button onClick={logout} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition-colors text-slate-400 hover:text-rose-600 dark:hover:text-rose-500">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              // Si NO hay sesión y NO es página de auth, mostramos botones
              !isAuthPage && (
                <>
                  <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white transition-colors">
                    Ingresar
                  </Link>
                  <Link to="/registro" className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-[#050507] text-sm font-black rounded-full hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/20">
                    Comenzar
                  </Link>
                </>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}