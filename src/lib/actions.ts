'use server'

import { prisma } from './prisma'
import { Product } from './types'

export async function getProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      category: category
    },
    orderBy: {
      name: 'asc'
    }
  })
}

export async function getProduct(category: string, id: string): Promise<Product | null> {
  return prisma.product.findFirst({
    where: {
      AND: [
        { category: category },
        { id: id }
      ]
    }
  })
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      featured: true
    },
    orderBy: {
      name: 'asc'
    }
  })
}