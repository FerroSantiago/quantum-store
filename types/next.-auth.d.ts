import 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'
import { Role, UserStatus } from "@prisma/client"

declare module 'next-auth' {
  interface User {
    id: string
    role: Role
    status: UserStatus
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      role: Role
      status: UserStatus
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    role: Role
    status: UserStatus
  }
}