export interface Product {
 id: string
 name: string
 price: number
 description: string
 image: string
 category: string
 categoryName: string
 featured?: boolean 
}

export interface Category {
 id: string
 name: string
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
  name: string | null;
  role: Role;
  status: UserStatus;
}

export interface UserTableItem {
  id: string
  email: string
  name: string | null
  role: Role
  status: UserStatus
  createdAt: Date
}