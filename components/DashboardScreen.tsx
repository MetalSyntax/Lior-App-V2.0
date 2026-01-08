import React from 'react';
import { User, ViewState } from '../types';
import { 
    Plus, 
    LogOut,
    FileSpreadsheet, 
    Clock
} from 'lucide-react';
import { StoredOrder } from '../types';

interface DashboardScreenProps {
  user: User;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onNavigate, onLogout }) => {
  const [pastOrders, setPastOrders] = React.useState<StoredOrder[]>([]);

  React.useEffect(() => {
    try {
        const saved = JSON.parse(localStorage.getItem('lior_orders') || '[]');
        // Filter by user and sort by date desc
        const userOrders = saved
            .filter((o: any) => o.userId === user.id)
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPastOrders(userOrders);
    } catch (e) {
        console.error("Error loading orders", e);
    }
  }, [user.id]);

  const handleDownloadHistoryCSV = (order: StoredOrder) => {
    const BOM = "\uFEFF"; 
    
    // Derived values
    const discountMultiplier = {
        'normal': 1,
        '20%': 0.8,
        '30%': 0.7
    }[order.discountType] || 1;

    const finalSubtotal = order.total;
    
    // Recalculate based on total
    const colecciones = finalSubtotal * 0.02;
    const proximaColeccion = 5.00;
    const sobrante = finalSubtotal;

    let csvContent = BOM;
    
    csvContent += ` ,Cliente\n`;
    csvContent += ` ,${user.name}\n`; 
    csvContent += ` ,Codigo\n`;
    csvContent += ` ,${user.id}\n`;
    
    csvContent += ` ,Codigo,Productos,Cantidad,Precio Unitario,Subtotal,Descuento\n`;
    
    order.cart.forEach(item => {
        let itemSubtotalVal = item.price * item.quantity;
        if (order.discountType !== 'normal') {
             itemSubtotalVal = itemSubtotalVal * discountMultiplier;
        }
        const itemSubtotal = itemSubtotalVal.toFixed(2);
        
        const safeName = item.name.includes(',') || item.name.includes('"') 
            ? `"${item.name.replace(/"/g, '""')}"` 
            : item.name;
        
        csvContent += ` ,${item.id},${safeName},${item.quantity},${item.price.toFixed(2)},${itemSubtotal},${order.discountType}\n`;
    });
    
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
    link.setAttribute("download", `Pedido de ${user.id} del ${order.displayDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background-light">
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
        </div>

        {/* History Section */}
        <div className="pb-10">
            <h3 className="text-lg font-bold text-text-dark font-display mb-4 px-2">Historial de Pedidos</h3>
            
            {pastOrders.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No hay pedidos recientes</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pastOrders.map((order) => (
                        <div key={order.id} className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex items-center justify-between group hover:border-secondary/30 transition-all">
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-text-dark text-base">{order.id}</span>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{order.displayDate}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <span className="text-lg font-bold text-primary font-display">
                                    ${order.total.toFixed(2)}
                                </span>
                                <button 
                                    onClick={() => handleDownloadHistoryCSV(order)}
                                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors border border-gray-100 h-10 w-10 flex items-center justify-center"
                                    title="Descargar CSV"
                                >
                                    <FileSpreadsheet className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </main>
      
    </div>
  );
};

export default DashboardScreen;