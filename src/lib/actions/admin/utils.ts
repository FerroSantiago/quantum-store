'use server'

import { auth } from '@/lib/auth'

export async function checkAdminRole() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('No autorizado')
  }
}