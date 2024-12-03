'use client'

import { Input } from '@/components/ui/input'

interface FormInputProps {
  id: string
  label: string
  type?: string
  required?: boolean
  disabled?: boolean
  error?: string
}

export function FormInput({ 
  id, 
  label, 
  type = "text", 
  required = false, 
  disabled = false,
  error
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label 
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <Input
        id={id}
        name={id}
        type={type}
        required={required}
        disabled={disabled}
        className={error ? "border-red-500" : ""}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

interface AuthFormProps {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void // Corregimos el tipo
  loading?: boolean
}

export function AuthForm({ 
  children, 
  onSubmit,
  loading = false 
}: AuthFormProps) {
  return (
    <form 
      onSubmit={onSubmit}
      className="space-y-4 w-full"
    >
      <div className="space-y-4">
        {children}
      </div>
      <div className="space-y-2">
        {loading && (
          <div className="text-center text-sm text-muted-foreground">
            Procesando...
          </div>
        )}
      </div>
    </form>
  )
}