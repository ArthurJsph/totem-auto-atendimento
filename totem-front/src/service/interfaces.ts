export interface Product {
  id?: string | number;
  name: string;
  description?: string;
  imageUrl?: string;
  ingredients?: string[];
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
  restaurantId?: string | number;
  menuCategoryId?: number;
  price?: number;
}

export interface User {
  id?: string | number;
  name: string;
  phone?: string;
  cpf?: string;
  email: string;
  password?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id?: number;
  userId:  number;
  description?: string;
  restaurantId?: number;
  productId?: string | number;
  quantity?: number;
  total?: number;
  price?: number;
  consumption_method?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: { qty: number; name: string }[];
}

export interface Payment {
  id?: string | number;
  orderId?: string | number;
  amount?: number;
  paymentMethod?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuCategory {
  id?: string | number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Restaurant {
  id?: string | number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Manager {
  id?: string | number;
    name: string;
    email: string;
    password?: string;
    restaurantId?: string | number;
    createdAt?: string;
    updatedAt?: string;
    role?: string;
}

export interface OrderItem {
    id?: string | number;
    name: string;
    price: number;
    quantity: number;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    productId?: number; // Belongs to a product
    orderId?: number; // Belongs to an order
}