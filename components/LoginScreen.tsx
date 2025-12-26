import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { USERS } from '../constants';
import { ChevronRight, Search } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    if (searchTerm.trim() === '') return [];
    return USERS.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-dvh relative bg-background-light">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-[50vh] md:h-[40vh] bg-gradient-to-b from-[#6FA89C] to-[#5D9489] rounded-b-[40px] md:rounded-b-[80px] z-0 shadow-lg" />
      
      {/* Content */}
      <main className="relative z-10 flex flex-col items-center flex-1 p-6 w-full max-w-md mx-auto justify-center">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 animate-fade-in-down">
          <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center shadow-xl mb-6 border-4 border-secondary/20 overflow-hidden p-4">
             <img 
               src="https://via.placeholder.com/150?text=LIOR" 
               alt="Lior Pedidos" 
               className="w-full h-full object-contain"
               onError={(e) => {
                 (e.target as HTMLImageElement).style.display = 'none';
                 (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
               }}
             />
             <div className="hidden text-center">
                <span className="block text-2xl font-bold text-secondary tracking-[0.2em]">LIOR</span>
                <span className="block text-[10px] text-text-dark font-semibold uppercase tracking-[0.3em] mt-1">Pedidos</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-display text-center drop-shadow-md">Bienvenido</h1>
          <p className="text-white/90 text-sm font-medium text-center">Seleccione su usuario para continuar</p>
        </div>

        {/* User Selection Card */}
        <div className="w-full bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-soft border border-white/40 animate-fade-in-up flex flex-col max-h-[500px]">
          <div className="space-y-3 flex flex-col h-full">
            <label className="text-xs font-bold text-text-dark uppercase tracking-wide ml-1 mb-2 block">
                Búsqueda de Usuario
            </label>
            
            {/* Search Bar */}
            <div className="relative mb-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Search className="w-4 h-4" />
                </span>
                <input 
                    type="text" 
                    placeholder="Escriba nombre o código..." 
                    className="w-full py-2.5 pl-9 pr-4 bg-white border border-gray-200 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto hide-scrollbar flex-1 pr-1">
                {searchTerm.trim() === '' ? (
                     <div className="text-center py-8 text-gray-400 text-sm flex flex-col items-center">
                        <Search className="w-8 h-8 opacity-20 mb-2" />
                        <p>Ingrese un nombre para buscar</p>
                    </div>
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => onLogin(user)}
                            className="group flex-shrink-0 flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-secondary transition-all duration-200 active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-background-light flex items-center justify-center text-secondary font-bold text-sm group-hover:bg-secondary group-hover:text-white transition-colors flex-shrink-0">
                                    {user.avatarInitials}
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="text-sm font-bold text-text-dark truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.id}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-secondary flex-shrink-0" />
                        </button>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        No se encontraron usuarios
                    </div>
                )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200/50 text-center flex-shrink-0">
             <p className="text-xs text-text-dark/60">
                ¿No encuentras tu usuario? <br/>
                <a href="#" className="font-bold text-secondary hover:underline mt-1 inline-block">Contactar Soporte</a>
             </p>
          </div>
        </div>

        <div className="mt-8 mb-4">
            <p className="text-[10px] text-text-dark/40 font-bold tracking-widest uppercase">Lior Pedidos v2.1</p>
        </div>

      </main>
    </div>
  );
};

export default LoginScreen;