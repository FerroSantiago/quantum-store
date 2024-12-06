// src/lib/actions/admin/users.ts
'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { UserStatus } from '@prisma/client'

async function checkAdminRole() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('No autorizado')
  }
}

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
      role: true,
      status: true,
      createdAt: true
    }
  })
}