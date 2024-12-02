import { notFound } from 'next/navigation'
import { getProductsByCategory } from '@/lib/actions'
import CategoryClient from './CategoryClient'
import { categories } from '@/lib/constants'

interface PageProps {
  params: { 
    category: string
  }
}

export default async function CategoryPage({ params }: PageProps) {
  // Verificar si la categoría existe
  const categoryExists = categories.some(cat => cat.id === params.category)
  if (!categoryExists) {
    notFound()
  }

  const products = await getProductsByCategory(params.category)

  return <CategoryClient initialProducts={products} category={params.category} />
}