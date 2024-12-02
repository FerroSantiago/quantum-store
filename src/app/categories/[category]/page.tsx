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

interface MetadataProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata(
  { params }: MetadataProps
): Promise<Metadata> {
  const resolvedParams = await params
  const category = categories.find(cat => cat.id === resolvedParams.category)
  
  if (!category) {
    return {
      title: 'Categoría no encontrada'
    }
  }

  return {
    title: `${category.name} | Quantum Store`,
    description: `Explora nuestra colección de ${category.name}`
  }
}

export default async function CategoryPage(props: PageProps) {
  const params = await props.params
  
  // Verificar que la categoría existe
  const category = categories.find(cat => cat.id === params.category)
  if (!category) {
    notFound()
  }

  const products = await getProductsByCategory(params.category)

  return <CategoryClient initialProducts={products} category={params.category} />
}