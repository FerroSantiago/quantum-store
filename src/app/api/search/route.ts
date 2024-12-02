import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ products: [] })
    }

    await prisma.$connect()

    const products = await prisma.product.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      orderBy: {
        name: 'asc'
      }
    })

    await prisma.$disconnect()
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Search error:', error)
    try {
      await prisma.$disconnect()
    } catch (e) {
      console.error('Error disconnecting from database:', e)
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}