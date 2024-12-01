'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { FeaturedFilterButton } from '../ui/featuredFilterButton'
import { ShoppingCart, Search, X } from 'lucide-react'
import Navigation from './Navigation'
import SearchResults from '../SearchResults'
import { useCart } from '@/contexts/CartContext'
import { useSearch } from '@/contexts/SearchContext'

export default function Header() {
  const { getTotalItems } = useCart()
  const { 
    searchQuery, 
    setSearchQuery, 
    showMobileSearch, 
    setShowMobileSearch 
  } = useSearch()
  
  const totalItems = getTotalItems()

  // Cerrar búsqueda móvil al cambiar de ruta
  useEffect(() => {
    return () => setShowMobileSearch(false)
  }, [setShowMobileSearch])

  return (
    <header className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {!showMobileSearch && (
            <Link href="/" className="text-2xl font-bold shrink-0">
              Logo
            </Link>
          )}
          
          <div className={`relative ${showMobileSearch ? 'flex-1' : 'hidden sm:block flex-1 max-w-xl'}`}>
            <Input 
              type="search" 
              placeholder="Buscar productos..." 
              className="w-full pl-4 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <SearchResults />
          </div>
          
          {showMobileSearch ? (
            <FeaturedFilterButton
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSearch(false)}
            >
              <X className="h-5 w-5" />
            </FeaturedFilterButton>
          ) : (
            <>
              <FeaturedFilterButton
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => setShowMobileSearch(true)}
              >
                <Search className="h-5 w-5" />
              </FeaturedFilterButton>
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
            </>
          )}
        </div>
      </div>
      {!showMobileSearch && <Navigation />}
    </header>
  )
}