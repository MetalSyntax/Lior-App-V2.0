export interface User {
    id: string;
    name: string;
    role: string;
    avatarInitials: string;
    email: string;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    imageType: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Order {
    id: string;
    customer: string;
    amount: number;
    status: 'Completado' | 'Pendiente';
    timeAgo: string;
}

export interface StoredOrder {
    id: string;
    date: string;
    displayDate: string;
    cart: CartItem[];
    total: number;
    discountType: string;
    userId: string;
}

export type ViewState = 'LOGIN' | 'DASHBOARD' | 'PRODUCTS' | 'SUMMARY';
