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
  const [discountType, setDiscountType] = React.useState('normal');

  const discountMultiplier = {
    'normal': 1,
    '20%': 0.8,
    '30%': 0.7
  }[discountType] || 1;

  const finalSubtotal = subtotal * discountMultiplier;

  const handleDownloadCSV = () => {
    // BOM for Excel to read UTF-8 correctly
    const BOM = "\uFEFF"; 
    
    // Dates for filename
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    
    // Calculations
    const colecciones = finalSubtotal * 0.02;
    const proximaColeccion = 5.00;
    const sobrante = finalSubtotal;

    let csvContent = BOM;
    
    // Header Info
    csvContent += ` ,Cliente\n`;
    csvContent += ` ,${user.name}\n`; 
    csvContent += ` ,Codigo\n`;
    csvContent += ` ,${user.id}\n`;
    
    // Table Headers
    csvContent += ` ,Codigo,Productos,Cantidad,Precio Unitario,Subtotal,Descuento\n`;
    
    // Table Rows
    cart.forEach(item => {
        // Line items show base price and subtotal. 
        // If the business logic requires line-item discount application in the CSV, we would do it here.
        // For now, we follow the pattern that 'Descuento' column indicates the rate.
        // We will apply the discount to the totals. 
        // OR: should we apply it to the line subtotal? 
        // Lets keep line subtotal as base, and just indicate discount. 
        // BUT better UX/Logic: If I buy with 20% discount, the line subtotal might technically be lower?
        // Let's stick to the user request: "salida debe ser igual a [CSV]". [CSV] has "normal".
        
        let itemSubtotalVal = item.price * item.quantity;
        if (discountType !== 'normal') {
             itemSubtotalVal = itemSubtotalVal * discountMultiplier;
        }

        const itemSubtotal = itemSubtotalVal.toFixed(2);
        
        const safeName = item.name.includes(',') || item.name.includes('"') 
            ? `"${item.name.replace(/"/g, '""')}"` 
            : item.name;
        
        csvContent += ` ,${item.id},${safeName},${item.quantity},${item.price.toFixed(2)},${itemSubtotal},${discountType}\n`;
    });
    
    // Footer Info
    csvContent += ` ,Precio Total\n`;
    csvContent += ` ,${finalSubtotal.toFixed(2)}\n`;
    csvContent += ` ,Colecciones\n`;
    csvContent += ` ,${colecciones.toFixed(2)}\n`;
    csvContent += ` ,Proxima Coleccion\n`;
    csvContent += ` ,${proximaColeccion.toFixed(2)}\n`;
    csvContent += ` ,Sobrante\n`;
    csvContent += ` ,${sobrante.toFixed(2)}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Pedido de ${user.id} del ${dateStr}.csv`);
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
                    <p className="text-3xl font-bold font-display">${finalSubtotal.toFixed(2)}</p>
                    <p className="text-xs text-white/70">{totalItems} Artículos</p>
                </div>
            </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 space-y-4 max-w-4xl mx-auto w-full">
        
        {/* Discount Selector */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-2">
            <label className="text-xs font-bold text-text-dark uppercase tracking-wide mb-2 block">
                Descuento Aplicable
            </label>
            <div className="relative">
                <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full appearance-none bg-background-light border border-gray-200 text-text-dark text-sm rounded-lg focus:ring-secondary focus:border-secondary block p-3 pr-8 outline-none font-medium transition-all"
                >
                    <option value="normal">Descuento normal</option>
                    <option value="20%">Dcto 20%</option>
                    <option value="30%">Dcto 30%</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                </div>
            </div>
        </div>

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
                            <span className="font-bold text-primary">
                                ${(item.price * item.quantity * discountMultiplier).toFixed(2)}
                            </span>
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
                onClick={() => {
                    handleDownloadCSV();
                    
                    // Save to local storage
                    const today = new Date();
                    const newOrder = {
                        id: `ORD-${Date.now().toString().slice(-6)}`,
                        date: today.toISOString(),
                        displayDate: `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`,
                        cart,
                        total: finalSubtotal,
                        discountType,
                        userId: user.id
                    };
                    
                    try {
                        const saved = JSON.parse(localStorage.getItem('lior_orders') || '[]');
                        localStorage.setItem('lior_orders', JSON.stringify([newOrder, ...saved]));
                    } catch (e) {
                        console.error('Error saving order', e);
                    }

                    onFinish();
                }}
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