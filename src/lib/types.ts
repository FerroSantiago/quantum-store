import { OrderStatus as PrismaOrderStatus } from "@prisma/client";

export interface Product {
 id: string
 name: string
 price: number
 description: string
 image: string
 category: string
 featured?: boolean 
}

export interface Category {
 id: string
 name: string
 href: string
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
 }

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  email: string;
  name: string;
  cuit: string;
  role: Role;
  status: UserStatus;
}

export interface UserTableItem {
  id: string
  email: string
  name: string
  cuit: string
  role: Role
  status: UserStatus
  createdAt: Date
}

export interface OrderItem {
  id: string;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user: {
    email: string;
    name: string | null;
  };
  total: number;
  status: PrismaOrderStatus;
  payment: {
    status: string;
    payment_id?: string | null;
  } | null;
  trackingNumber: string | null;
  items: OrderItem[];
  createdAt: string;
}

export { PrismaOrderStatus as OrderStatus };