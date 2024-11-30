'use client'

import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Search } from 'lucide-react'
import Navigation from './Navigation'
import { useCart } from '@/contexts/CartContext'

export default function Header() {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <header className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold shrink-0">
            Logo
          </Link>
          
          <div className="hidden sm:block flex-1 max-w-xl">
            <div className="relative">
              <Input 
                type="search" 
                placeholder="Buscar productos..." 
                className="w-full pl-4 pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="ml-auto relative">
            <Link href="/cart">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      <Navigation />
    </header>
  )
}