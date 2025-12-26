import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { PRODUCTS, CATEGORIES } from '../constants';
import { ArrowLeft, ShoppingCart, Search, Droplets, Sparkles, SprayCan, Circle, Square, Minus, Plus, ArrowRight, Receipt, Package, Wind } from 'lucide-react';

interface ProductScreenProps {
  cart: CartItem[];
  onUpdateCart: (product: Product, quantity: number) => void;
  onBack: () => void;
  onGoToSummary: () => void;
  totalItems: number;
  subtotal: number;
}

const ProductScreen: React.FC<ProductScreenProps> = ({ cart, onUpdateCart, onBack, onGoToSummary, totalItems, subtotal }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getQuantity = (productId: string) => {
    return cart.find(item => item.id === productId)?.quantity || 0;
  };

  const renderIcon = (imgName: string) => {
    const name = imgName.toLowerCase();
    if (name.includes('shampoo') || name.includes('gel')) return <Droplets className="w-8 h-8" />;
    if (name.includes('conditioner') || name.includes('capilar')) return <Wind className="w-8 h-8" />;
    if (name.includes('beauty') || name.includes('special')) return <Sparkles className="w-8 h-8" />;
    if (name.includes('spray') || name.includes('cologne') || name.includes('perfume')) return <SprayCan className="w-8 h-8" />;
    if (name.includes('cream') || name.includes('lotion')) return <Circle className="w-8 h-8" />;
    if (name.includes('soap')) return <Square className="w-8 h-8" />;
    
    return <Package className="w-8 h-8" />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
            <button 
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
                <h1 className="text-white text-lg font-bold tracking-wide font-display">LIOR PEDIDOS</h1>
                <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Nueva Orden</p>
            </div>
            </div>
            <button className="relative p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-secondary">
                    {totalItems}
                </span>
            )}
            </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Search & Filter */}
        <section className="space-y-4">
            <h2 className="text-2xl font-bold text-text-dark font-display">Seleccione un Producto</h2>
            <div className="relative group max-w-xl">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-secondary transition-colors">
                    <Search className="w-5 h-5" />
                </span>
                <input 
                    type="text" 
                    placeholder="Buscar por nombre o código..." 
                    className="w-full py-3.5 pl-12 pr-4 bg-white border-none rounded-xl shadow-sm text-text-dark placeholder-gray-400 focus:ring-2 focus:ring-secondary outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Filter Category Scroll - Used 'hide-scrollbar' class from index.html */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
                <div className="flex gap-3 flex-nowrap">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold shadow-sm whitespace-nowrap transition-all border ${
                                activeCategory === category 
                                    ? 'bg-primary text-white border-primary shadow-md transform scale-105' 
                                    : 'bg-white text-text-dark border-transparent hover:bg-gray-50'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </section>

        {/* Product List - Responsive Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => {
                const qty = getQuantity(product.id);
                return (
                    <div key={product.id} className={`bg-white rounded-xl shadow-soft p-4 flex flex-col gap-4 border-l-4 transition-all duration-300 h-full ${qty > 0 ? 'border-primary' : 'border-transparent hover:border-primary/30'}`}>
                        <div className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 flex-shrink-0">
                                {renderIcon(product.imageType)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-sm leading-tight text-text-dark font-display line-clamp-2" title={product.name}>{product.name}</h3>
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-mono mb-0.5">{product.id}</p>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{product.unit}</p>
                                    </div>
                                    <p className="text-primary font-bold text-xl">${product.price.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                            {qty > 0 ? (
                                <>
                                    <div className="flex items-center bg-gray-50 rounded-lg shadow-inner">
                                        <button 
                                            onClick={() => onUpdateCart(product, qty - 1)}
                                            className="w-10 h-10 flex items-center justify-center text-primary hover:bg-gray-200 rounded-l-lg transition-colors"
                                        >
                                            <Minus className="w-4 h-4 stroke-[3]" />
                                        </button>
                                        <div className="w-10 text-center font-bold text-text-dark">{qty}</div>
                                        <button 
                                            onClick={() => onUpdateCart(product, qty + 1)}
                                            className="w-10 h-10 flex items-center justify-center text-primary hover:bg-gray-200 rounded-r-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4 stroke-[3]" />
                                        </button>
                                    </div>
                                    <button className="bg-text-dark text-white px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-lg animate-fade-in">
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        <span>Carro</span>
                                    </button>
                                </>
                            ) : (
                                <div className="flex justify-end w-full">
                                    <button 
                                        onClick={() => onUpdateCart(product, 1)}
                                        className="bg-secondary/10 text-secondary hover:bg-secondary hover:text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-300 w-full justify-center"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Agregar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </section>
        
        {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-gray-400">
                <p>No se encontraron productos.</p>
            </div>
        )}
      </main>

      {/* Bottom Sheet Summary - Fixed Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 w-full bg-text-dark shadow-[0_-8px_30px_rgba(0,0,0,0.3)] rounded-t-3xl transition-transform duration-300 z-40 ${totalItems > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-full flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-6 pt-2">
            <div className="flex justify-between items-end mb-5 text-white">
                <div>
                    <p className="text-xs font-medium text-white/60 uppercase tracking-widest mb-1">Resumen Parcial</p>
                    <div className="flex gap-8">
                        <div>
                            <span className="text-[10px] text-white/50 block font-bold">ARTÍCULOS</span>
                            <span className="text-xl font-bold font-display">{totalItems}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-white/50 block font-bold">SUBTOTAL</span>
                            <span className="text-xl font-bold text-primary font-display">${subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/5">
                    <Receipt className="text-white w-6 h-6" />
                </div>
            </div>
            <button 
                onClick={onGoToSummary}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-glow active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm tracking-wide uppercase"
            >
                <span>Ver Resumen del Pedido</span>
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
