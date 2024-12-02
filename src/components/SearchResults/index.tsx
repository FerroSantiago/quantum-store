'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSearch } from '@/contexts/SearchContext'
import { Card } from '@/components/ui/card'

export default function SearchResults() {
  const { searchResults, isSearching, searchQuery } = useSearch()

  if (!searchQuery) return null

  return (
    <div className="absolute top-full left-0 right-0 bg-background border rounded-md mt-1 shadow-lg max-h-[70vh] overflow-y-auto z-50">
      {isSearching ? (
        <div className="p-4 text-center text-muted-foreground">
          Buscando...
        </div>
      ) : searchResults.length > 0 ? (
        <div className="p-2">
          <p className="text-sm text-muted-foreground px-2 py-1">
            {searchResults.length} resultados para &quot;{searchQuery}&quot;
          </p>
          <div className="space-y-2">
            {searchResults.map((product) => (
              <Link 
                key={product.id} 
                href={`/categories/${product.category}/${product.id}`}
                className="block"
              >
                <Card className="hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3 p-2">
                    <div className="relative w-12 h-12 shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.categoryName}</p>
                      <p className="text-sm font-medium text-primary">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          No se encontraron productos para &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  )
}