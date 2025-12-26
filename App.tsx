import React, { useState, useMemo } from 'react';
import { User, CartItem, Product, ViewState } from './types';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import ProductScreen from './components/ProductScreen';
import OrderSummaryScreen from './components/OrderSummaryScreen';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('LOGIN');
    setCart([]);
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
  };

  const handleUpdateCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (quantity === 0) {
        return prev.filter(item => item.id !== product.id);
      }
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleFinishOrder = () => {
    setCart([]);
    setCurrentView('DASHBOARD');
  };

  const cartTotalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

  return (
    <div className="w-full min-h-screen bg-background-light font-body text-text-dark">
      {currentView === 'LOGIN' && (
        <LoginScreen onLogin={handleLogin} />
      )}

      {currentView === 'DASHBOARD' && currentUser && (
        <DashboardScreen 
          user={currentUser} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
        />
      )}

      {currentView === 'PRODUCTS' && (
        <ProductScreen 
          cart={cart}
          onUpdateCart={handleUpdateCart}
          onBack={() => setCurrentView('DASHBOARD')}
          onGoToSummary={() => setCurrentView('SUMMARY')}
          totalItems={cartTotalItems}
          subtotal={cartSubtotal}
        />
      )}

      {currentView === 'SUMMARY' && currentUser && (
        <OrderSummaryScreen 
            cart={cart}
            user={currentUser}
            onBack={() => setCurrentView('PRODUCTS')}
            onFinish={handleFinishOrder}
            totalItems={cartTotalItems}
            subtotal={cartSubtotal}
        />
      )}
    </div>
  );
};

export default App;
