import React from 'react';
import { CartItem, User } from '../types';
import { ArrowLeft, CheckCircle, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface OrderSummaryScreenProps {
  cart: CartItem[];
  user: User;
  onBack: () => void;
  onFinish: () => void;
  totalItems: number;
  subtotal: number;
}

const OrderSummaryScreen: React.FC<OrderSummaryScreenProps> = ({ cart, user, onBack, onFinish, totalItems, subtotal }) => {

  const handleDownloadCSV = () => {
    // BOM for Excel to read UTF-8 correctly
    const BOM = "\uFEFF"; 
    const headers = "ID,Producto,Categoría,Precio Unitario,Cantidad,Total\n";
    
    const rows = cart.map(item => {
        // Escape quotes in names
        const safeName = `"${item.name.replace(/"/g, '""')}"`;
        const total = (item.price * item.quantity).toFixed(2);
        return `${item.id},${safeName},${item.category},${item.price},${item.quantity},${total}`;
    }).join("\n");

    const summaryRow = `\n,,,,,Subtotal,${subtotal.toFixed(2)}`;
    const userRow = `\nCliente: ${user.name} (${user.id})\nFecha: ${new Date().toLocaleDateString()}`;

    const csvContent = BOM + userRow + "\n\n" + headers + rows + summaryRow;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Pedido_${user.id}_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background-light">
      {/* Header */}
      <header className="bg-secondary text-white pt-8 pb-8 px-6 rounded-b-[2rem] shadow-lg sticky top-0 z-20 pt-safe">
        <div className="max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-4">
            <button 
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold font-display">Resumen del Pedido</h1>
            </div>
            
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs text-white/70 font-medium uppercase tracking-wider mb-1">Cliente</p>
                    <p className="text-lg font-bold leading-tight">{user.name}</p>
                    <p className="text-xs text-white/70">{user.id}</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold font-display">${subtotal.toFixed(2)}</p>
                    <p className="text-xs text-white/70">{totalItems} Artículos</p>
                </div>
            </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 space-y-4 max-w-4xl mx-auto w-full">
        {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <AlertCircle className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">El carrito está vacío</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cart.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div className="flex-1 pr-4">
                            <h3 className="font-bold text-text-dark text-sm line-clamp-2">{item.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{item.id}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                            <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-text-dark">x{item.quantity}</span>
                            <span className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>

      {/* Footer Actions */}
      <footer className="bg-white border-t border-gray-100 p-6 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl">
        <div className="max-w-4xl mx-auto w-full space-y-3">
            <button 
                onClick={handleDownloadCSV}
                disabled={cart.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Descargar CSV</span>
            </button>
            
            <button 
                onClick={onFinish}
                className="w-full bg-text-dark hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <CheckCircle className="w-5 h-5" />
                <span>Finalizar Orden</span>
            </button>
        </div>
      </footer>
    </div>
  );
};

export default OrderSummaryScreen;