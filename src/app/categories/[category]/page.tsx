import { notFound } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { getProductsByCategory } from '@/lib/actions'

interface PageProps {
  params: { 
    category: string
  }
}

export default function CategoryPage({ params }: PageProps) {
  const products = getProductsByCategory(params.category)

  if (products.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Productos de {products[0].categoryName}
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            {...product} 
            href={`/categories/${params.category}/${product.id}`}
          />
        ))}
      </div>
    </div>
  )
}