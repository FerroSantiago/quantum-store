'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { AuthForm, FormInput } from '@/components/ui/auth-form'
import { toast } from 'sonner'

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  form?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { status } = useSession()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  // Si está autenticado, no mostrar nada mientras redirige
  if (status === 'authenticated') {
    return null
  }

  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {}
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Validación de email
    if (!email || !email.includes('@')) {
      newErrors.email = "Email inválido"
    }

    // Validación de contraseña
    if (!password || password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    // Validación de confirmación de contraseña
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
  
    const formData = new FormData(e.currentTarget)
    
    if (!validateForm(formData)) {
      setLoading(false)
      return
    }
  
    try {
      const registerData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        name: formData.get('name') as string,
      }
  
      // Registro del usuario
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        throw new Error(data.error || "Error al registrar usuario")
      }
  
      // Login automático después del registro
      const result = await signIn('credentials', {
        redirect: false,
        email: registerData.email,
        password: registerData.password,
      })
  
      if (result?.error) {
        throw new Error("Error al iniciar sesión automáticamente")
      }
  
      router.push('/dashboard')
      toast.success('¡Registro exitoso!')
    } catch (error) {
      console.error('Error:', error)
      setErrors({ 
        form: error instanceof Error ? error.message : "Algo salió mal" 
      })
      toast.error(error instanceof Error ? error.message : "Error en el registro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Crear una cuenta</h1>
          <p className="text-muted-foreground">
            Ingresa tus datos para registrarte
          </p>
        </div>

        <AuthForm onSubmit={handleSubmit} loading={loading}>
          <FormInput
            id="name"
            label="Nombre"
            required
            disabled={loading}
            error={errors.name}
          />
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
          <FormInput
            id="confirmPassword"
            label="Confirmar Contraseña"
            type="password"
            required
            disabled={loading}
            error={errors.confirmPassword}
          />

          {errors.form && (
            <p className="text-sm text-red-500 text-center">{errors.form}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </AuthForm>

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}