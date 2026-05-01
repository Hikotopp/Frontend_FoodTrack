export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'SERVING' | 'WAITING_PAYMENT' | 'CLEANING';
export type MenuCategory = 'APPETIZER' | 'SOUP' | 'MAIN_COURSE' | 'SALAD' | 'DESSERT' | 'DRINK';
export type OrderStatus = 'OPEN' | 'CLOSED' | 'CANCELLED';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  available: boolean;
}

export interface OrderLine {
  id: number;
  menuItemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CustomerOrder {
  id: number;
  tableId: number;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  lines: OrderLine[];
}

export interface RestaurantTable {
  id: number;
  tableNumber: number;
  status: TableStatus;
}

export interface TableSummary {
  id: number;
  tableNumber: number;
  status: TableStatus;
  total: number;
  itemCount: number;
}

export interface TableDashboard {
  table: RestaurantTable;
  currentOrder: CustomerOrder | null;
  menuItems: MenuItem[];
}export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'SERVING' | 'WAITING_PAYMENT' | 'CLEANING';
export type MenuCategory = 'APPETIZER' | 'SOUP' | 'MAIN_COURSE' | 'SALAD' | 'DESSERT' | 'DRINK';
export type OrderStatus = 'OPEN' | 'CLOSED' | 'CANCELLED';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  available: boolean;
}

export interface OrderLine {
  id: number;
  menuItemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CustomerOrder {
  id: number;
  tableId: number;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  lines: OrderLine[];
}

export interface RestaurantTable {
  id: number;
  tableNumber: number;
  status: TableStatus;
}

export interface TableSummary {
  id: number;
  tableNumber: number;
  status: TableStatus;
  total: number;
  itemCount: number;
}

export interface TableDashboard {
  table: RestaurantTable;
  currentOrder: CustomerOrder | null;
  menuItems: MenuItem[];
}