import { notFound } from 'next/navigation'
import { getProductsByCategory } from '@/lib/actions'
import CategoryClient from './CategoryClient'
import { categories } from '@/lib/constants'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface MetadataProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata(
  { params }: MetadataProps
): Promise<Metadata> {
  const { category } = await params;
  const categoryData = categories.find(cat => cat.id === category)
  
  if (!categoryData) {
    return {
      title: 'Categoría no encontrada'
    }
  }

  return {
    title: `${categoryData.name} | Quantum Store`,
    description: `Explora nuestra colección de ${categoryData.name}`
  }
}

export default async function CategoryPage(props: PageProps) {
  const { category } = await props.params;
  
  const categoryData = categories.find(cat => cat.id === category)
  if (!categoryData) {
    notFound()
  }

  const products = await getProductsByCategory(category)

  return <CategoryClient initialProducts={products} category={category} />
}