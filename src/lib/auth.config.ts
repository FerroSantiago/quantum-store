import type { NextAuthConfig } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { Role } from '@prisma/client'
import { JWT } from 'next-auth/jwt'

interface Credentials {
  email: string
  password: string
}

interface AuthUser {
  id: string
  email: string
  name: string | null
  role: Role
}

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
      async authorize(credentials): Promise<AuthUser | null> {
        const { email, password } = credentials as Credentials

        if (!email || !password) {
          throw new Error("Credenciales inválidas")
        }

        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user || !user.password) {
          throw new Error("Usuario no encontrado")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role
        } as JWT
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user && token.id && token.role) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role as Role
        }
      }
      return session
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
}