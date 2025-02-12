'use server'

import { prisma } from '@/lib/prisma'
import { checkAdminRole } from './utils'
import { revalidatePath } from 'next/cache'
import { UserStatus } from '@prisma/client'

export async function updateUserStatus(userId: string, status: UserStatus) {
  await checkAdminRole()

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: status
      }
    })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (err) {
    console.error('Error al actualizar usuario:', err)
    throw new Error('Error al actualizar el estado del usuario')
  }
}

export async function getUsers() {
  await checkAdminRole()

  return prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      email: true,
      name: true,
      cuit: true,
      role: true,
      status: true,
      createdAt: true
    }
  })
}