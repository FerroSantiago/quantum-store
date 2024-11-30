'use client'

import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/lib/types'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const router = useRouter()

  const handleClick = () => {
    addToCart(product)
    toast.success('Producto agregado al carrito', {
      description: product.name,
      action: {
        label: 'Ver carrito',
        onClick: () => router.push('/cart')
      }
    })
  }

  return (
    <button
      className={cn(
        "flex items-center gap-2 hover:bg-white/10",
        "px-4 py-2 rounded-md",
        "border border-white text-white",
        "transition-colors"
      )}
      onClick={handleClick}
    >
      <span>Agregar al carrito</span>
      <ShoppingCart className="h-5 w-5" />
    </button>
  )
}