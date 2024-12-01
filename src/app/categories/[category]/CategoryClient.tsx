'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'
import { Product } from '@/lib/types'

interface CategoryClientProps {
  initialProducts: Product[]
  category: string
}

export default function CategoryClient({ initialProducts, category }: CategoryClientProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Productos de {initialProducts[0].categoryName}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Mostrando {filteredProducts.length} de {initialProducts.length} productos
          </p>
        </div>
        <ProductFilters 
          products={initialProducts}
          onFilterChange={setFilteredProducts}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            {...product} 
            href={`/categories/${category}/${product.id}`}
          />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron productos con los filtros seleccionados
        </div>
      )}
    </div>
  )
}