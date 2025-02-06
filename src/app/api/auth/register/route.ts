import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    await prisma.$connect()
    const data = await request.json()
    const { email, name, cuit, password } = data

    if (!email || !password || !name || !cuit) {
      return NextResponse.json(
        { error: "Email, contraseña, nombre y cuit son requeridos" },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email,
        name,
        cuit,
        password: hashedPassword,
        role: 'USER'
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        cuit: user.cuit,
      }
    })
  } catch (error) {
    console.error('Error en registro:', error)
    
    try {
      await prisma.$disconnect()
    } catch (e) {
      console.error('Error disconnecting from database:', e)
    }

    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 }
    )
  }
}