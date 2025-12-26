import React from 'react';
import { User, ViewState } from '../types';
import { 
    Plus, 
    LogOut
} from 'lucide-react';

interface DashboardScreenProps {
  user: User;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onNavigate, onLogout }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      {/* Header */}
      <header className="bg-secondary text-white pt-12 pb-16 px-6 rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-lg sticky top-0 z-20">
        <div className="max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-secondary font-bold text-lg shadow-md">
                {user.avatarInitials}
                </div>
                <div className="flex flex-col">
                <span className="text-xs opacity-80 font-medium tracking-wide">BIENVENIDO</span>
                <h1 className="text-xl font-bold font-display leading-tight">{user.name}</h1>
                </div>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={onLogout}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                    <LogOut className="w-5 h-5 text-white" />
                </button>
            </div>
            </div>
        </div>
      </header>

      <main className="flex-1 px-6 -mt-8 relative z-20 space-y-6 max-w-6xl mx-auto w-full">
        
        {/* Main Action */}
        <div className="py-10 flex flex-col items-center">
            <button 
                onClick={() => onNavigate('PRODUCTS')}
                className="w-full max-w-lg bg-primary hover:bg-primary-dark text-white p-1 rounded-2xl shadow-glow transform transition-all active:scale-[0.98] group"
            >
                <div className="flex items-center justify-between px-6 py-6">
                    <div className="flex flex-col items-start text-left">
                        <span className="text-2xl font-bold font-display">Nuevo Pedido</span>
                        <span className="text-sm opacity-90 font-medium mt-1">Comenzar a registrar productos</span>
                    </div>
                    <div className="bg-white/25 rounded-full p-3 group-hover:rotate-90 transition-transform duration-300">
                        <Plus className="w-8 h-8 text-white" />
                    </div>
                </div>
            </button>

            <div className="mt-8 text-center px-8">
                 <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-md mx-auto">
                    Las funcionalidades adicionales del panel están deshabilitadas temporalmente por mantenimiento.
                 </p>
            </div>
        </div>

      </main>
      
    </div>
  );
};

export default DashboardScreen;
