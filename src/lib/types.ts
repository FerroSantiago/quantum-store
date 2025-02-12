import { OrderStatus as PrismaOrderStatus, PaymentStatus as PrismaPaymentStatus } from "@prisma/client";

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

export interface User {
  id: string
  email: string
  name: string | null
  cuit: string
  role: Role
  status: UserStatus
}

export interface UserTableItem {
  id: string
  email: string
  name: string | null
  cuit: string
  role: Role
  status: UserStatus
  createdAt: Date
}

export interface OrderItem {
  id: string
  product: {
    name: string
    price: number
  }
  quantity: number
  price: number
}

export interface Order {
  id: string
  user: {
    email: string
    name: string | null
  };
  totalAmount: number
  status: PrismaOrderStatus
  payments: Payment[]
  notes?: string | null
  items: OrderItem[]
  createdAt: string
}

export interface Payment {
  id: string
  orderId: string
  status: PrismaPaymentStatus
  amountPaid: number
  receiptURL?: string | null
  createdAt: string
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

export { PrismaOrderStatus as OrderStatus, PrismaPaymentStatus as PaymentStatus };