'use client'

import { useCart } from '@/contexts/CartContext'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
        <p>No hay items en el carrito</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
      <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        {items.map(item => (
          <Card key={item.id} className="mb-4 p-4">
            <div className="flex gap-4">
              <div className="relative w-24 h-24">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-auto p-1 hover:bg-gray-100 rounded text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
        <div>
          <Card className="p-4">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <button className="w-full mt-4 bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors">
                Proceder al pago
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}