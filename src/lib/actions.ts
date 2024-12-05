'use server'

import { prisma } from './prisma'
import { Product } from './types'
import { auth } from '@/lib/auth'

interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  product: Product
}

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


export async function addToCart(productId: string, quantity: number = 1): Promise<CartItem> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión para agregar items al carrito')
  }

  try {
    // Intentar actualizar si existe
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId: productId
      }
    })

    if (existingItem) {
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true }
      })
    }

    // Crear nuevo item si no existe
    return await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        productId: productId,
        quantity: quantity
      },
      include: { product: true }
    })
  } catch (error) {
    console.error('Error al agregar al carrito:', error)
    throw new Error('Error al agregar el producto al carrito')
  }
}


export async function removeFromCart(itemId: string): Promise<void> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('No autorizado')
  }

  try {
    await prisma.cartItem.delete({
      where: {
        id: itemId,
        userId: session.user.id
      }
    })
  } catch (error) {
    console.error('Error al eliminar del carrito:', error)
    throw new Error('Error al eliminar el producto del carrito')
  }
}


export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('No autorizado')
  }

  try {
    return await prisma.cartItem.update({
      where: {
        id: itemId,
        userId: session.user.id
      },
      data: { quantity },
      include: { product: true }
    })
  } catch (error) {
    console.error('Error al actualizar cantidad:', error)
    throw new Error('Error al actualizar la cantidad')
  }
}

export async function getCart(): Promise<CartItem[]> {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  try {
    return await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: true
      }
    })
  } catch (error) {
    console.error('Error al obtener el carrito:', error)
    throw new Error('Error al obtener el carrito')
  }
}