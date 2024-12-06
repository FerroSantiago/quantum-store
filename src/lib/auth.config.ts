import type { NextAuthConfig } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { Role, UserStatus } from '@prisma/client'

interface AuthUser {
  id: string
  email: string
  name: string | null
  role: Role
  status: UserStatus
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
        const { email, password } = credentials as { 
          email: string, 
          password: string 
        }

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
          role: user.role,
          status: user.status
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user && user.id) {
        const newToken = token as JWT & {
          id: string
          role: Role
          status: UserStatus
        }
        newToken.id = user.id
        newToken.role = user.role
        newToken.status = user.status
        return newToken
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as Role,
          status: token.status as UserStatus
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