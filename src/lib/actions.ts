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
  try {
    return await prisma.product.findFirst({
      where: {
        AND: [
          { category },
          { id: { equals: id.slice(-24) } } // Aseguramos que solo usamos los últimos 24 caracteres
        ]
      }
    })
  } catch (error) {
    console.error('Error en getProduct:', error)
    return null
  }
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