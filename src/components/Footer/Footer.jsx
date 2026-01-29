import React from 'react';
import { Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#020203] py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
        
        <div className="mb-4 p-3 bg-slate-100 dark:bg-white/5 rounded-full text-slate-500 dark:text-slate-600">
          <Code2 size={20} />
        </div>

        <p className="text-slate-500 text-xs font-medium tracking-wide">
          &copy; {new Date().getFullYear()} <span className="text-slate-900 dark:text-slate-300 font-bold">TOMMASYS</span>.
        </p>
        
        <p className="text-slate-400 dark:text-slate-600 text-[10px] mt-2 uppercase tracking-widest">
          Ingeniería de Software & Soluciones SaaS
        </p>

      </div>
    </footer>
  );
}