'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'
import { Product } from '@/lib/types'
import { categories } from '@/lib/constants'

interface CategoryClientProps {
  initialProducts: Product[]
  category: string
}

const PRODUCTS_PER_PAGE = 12

export default function CategoryClient({ initialProducts, category }: CategoryClientProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    setDisplayedProducts(filteredProducts.slice(0, page * PRODUCTS_PER_PAGE))
  }, [filteredProducts, page])

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  const categoryName = categories.find(cat => cat.id === category)?.name || category

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Productos de {categoryName}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Mostrando {displayedProducts.length} de {filteredProducts.length} productos
          </p>
        </div>
        <ProductFilters 
          products={initialProducts}
          onFilterChange={products => {
            setFilteredProducts(products)
            setPage(1)
          }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {displayedProducts.map(product => (
          <ProductCard 
            key={product.id}
            {...product}
          />
        ))}
      </div>
      {displayedProducts.length < filteredProducts.length && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Cargar más productos
          </button>
        </div>
      )}
      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron productos con los filtros seleccionados
        </div>
      )}
    </div>
  )
}