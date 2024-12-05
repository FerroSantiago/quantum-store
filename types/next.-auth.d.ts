import 'next-auth'
import { Role } from "@prisma/client"
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    role: Role
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      role: Role
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    role: Role
  }
}