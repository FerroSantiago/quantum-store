'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function checkAdminRole() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('No autorizado')
  }
}

export async function createProduct(formData: FormData) {
  await checkAdminRole()

  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const description = formData.get('description') as string
  const image = formData.get('image') as string
  const category = formData.get('category') as string
  const categoryName = formData.get('categoryName') as string
  const featured = formData.get('featured') === 'true'

  if (!name || !price || !description || !image || !category || !categoryName) {
    throw new Error('Todos los campos son requeridos')
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        image,
        category,
        categoryName,
        featured
      }
    })
    
    revalidatePath('/admin/products')
    return { success: true, product }
  } catch (error) {
    console.error('Error al crear producto:', error)
    throw new Error('Error al crear el producto')
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  await checkAdminRole()

  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const description = formData.get('description') as string
  const image = formData.get('image') as string
  const category = formData.get('category') as string
  const categoryName = formData.get('categoryName') as string
  const featured = formData.get('featured') === 'true'

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        description,
        image,
        category,
        categoryName,
        featured
      }
    })

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    throw new Error('Error al actualizar el producto')
  }
}

export async function deleteProduct(productId: string) {
  await checkAdminRole()

  try {
    await prisma.product.delete({
      where: { id: productId }
    })

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    throw new Error('Error al eliminar el producto')
  }
}