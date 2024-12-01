import { notFound } from 'next/navigation'
import { getProductsByCategory } from '@/lib/actions'
import CategoryClient from './CategoryClient'

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

  return <CategoryClient initialProducts={products} category={params.category} />
}