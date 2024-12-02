import { notFound } from 'next/navigation'
import { getProductsByCategory } from '@/lib/actions'
import CategoryClient from './CategoryClient'
import { categories } from '@/lib/constants'
import { Metadata } from 'next'

type PageProps = {
  params: Promise<{
    category: string;
  }>;
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ params }: { 
  params: { category: string } 
}): Promise<Metadata> {
  const category = categories.find(cat => cat.id === params.category)
  
  if (!category) {
    return {
      title: 'Categoría no encontrada'
    }
  }

  return {
    title: `${category.name} | Quantum Store`,
    description: `Explora nuestra colección de ${category.name}`,
  }
}

export default async function CategoryPage(props: PageProps) {
  const params = await props.params
  const categoryExists = categories.some(cat => cat.id === params.category)
  
  if (!categoryExists) {
    notFound()
  }

  const products = await getProductsByCategory(params.category)

  return <CategoryClient initialProducts={products} category={params.category} />
}