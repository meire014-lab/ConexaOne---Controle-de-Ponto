
import React from 'react';

const Header: React.FC = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-stone-100 py-4 sticky top-0 z-50 safe-top">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stone-900 rounded-2xl flex items-center justify-center shadow-lg shadow-stone-200 transition-transform active:scale-90">
            <span className="text-white font-bold text-xl italic transition-transform">C</span>
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-black text-stone-900 tracking-tighter">
              Conexa<span className="text-stone-300 font-medium">One</span>
            </h1>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Gestão</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden xs:block">
            <p className="text-xs font-black text-stone-800 leading-none">{getGreeting()}!</p>
            <p className="text-[9px] text-stone-400 font-bold uppercase mt-1">Augusto</p>
          </div>
          <div className="relative group">
            <div className="w-11 h-11 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center shadow-sm active:scale-95 transition-all overflow-hidden">
               <span className="text-stone-900 font-black text-lg tracking-tighter select-none">A</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
