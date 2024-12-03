import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/actions'
import { extractIdFromSlug } from '@/lib/utils'
import ProductView from './ProductView'
import { Suspense } from 'react'

interface PageProps {
  params: {
    category: string;
    slug: string;
  }
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params

  try {
    const id = extractIdFromSlug(resolvedParams.slug)
    if (!id) {
      console.error('ID no encontrado en el slug')
      notFound()
    }

    const product = await getProduct(resolvedParams.category, id)
    if (!product) {
      console.error('Producto no encontrado')
      notFound()
    }

    return (
      <Suspense fallback={<div>Cargando...</div>}>
        <ProductView product={product} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error:', error)
    notFound()
  }
}