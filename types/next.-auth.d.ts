import 'next-auth'
import { Role } from "@prisma/client"

declare module 'next-auth' {
  interface User {
    role: Role
  }
  
  interface Session {
    user: User & {
      id: string
      email: string
      name: string | null
      role: Role
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role: Role
  }
}