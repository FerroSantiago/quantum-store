import type { NextAuthConfig } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "ejemplo@email.com"
        },
        password: { 
          label: "Contraseña", 
          type: "password" 
        }
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email as string | undefined
          const password = credentials?.password as string | undefined

          if (!email || !password) {
            throw new Error("Credenciales inválidas")
          }

          const user = await prisma.user.findUnique({
            where: { 
              email: email // Ahora email es un string
            }
          })

          if (!user || !user.password) {
            throw new Error("Usuario no encontrado")
          }

          const isValidPassword = await bcrypt.compare(
            password, // Ahora password es un string
            user.password
          )

          if (!isValidPassword) {
            throw new Error("Contraseña incorrecta")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  trustHost: true,
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
}