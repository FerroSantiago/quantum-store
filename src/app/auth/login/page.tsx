'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { AuthForm, FormInput } from '@/components/ui/auth-form'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { status } = useSession()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  // Si está autenticado, no mostrar nada mientras redirige
  if (status === 'authenticated') {
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      })

      if (res?.error) {
        setErrors({ form: "Credenciales inválidas" })
        toast.error("Credenciales inválidas")
        return
      }

      router.push('/dashboard')
      toast.success('¡Bienvenido de vuelta!')
    } catch (err) {
      console.error('Error de login:', err)
      setErrors({ form: "Algo salió mal. Por favor, intenta de nuevo." })
      toast.error('Algo salió mal. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
          <p className="text-muted-foreground">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        <AuthForm onSubmit={handleSubmit} loading={loading}>
          <FormInput
            id="email"
            label="Email"
            type="email"
            required
            disabled={loading}
            error={errors.email}
          />
          <FormInput
            id="password"
            label="Contraseña"
            type="password"
            required
            disabled={loading}
            error={errors.password}
          />

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </AuthForm>

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}