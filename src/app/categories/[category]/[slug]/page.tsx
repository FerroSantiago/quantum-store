import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/actions'
import { extractIdFromSlug } from '@/lib/utils'
import ProductView from './ProductView'
import { Suspense } from 'react'
import type { Metadata } from 'next'

// Definimos los tipos exactos que Next.js espera
interface PageProps {
  params: Promise<{ category: string; slug: string }>
  searchParams?: { [key: string]: string | string[] | undefined }
}

// Componente de carga separado que maneja la asincronía
async function ProductLoader({
  params
}: {
  params: { category: string; slug: string }
}) {
  const id = extractIdFromSlug(params.slug)
  if (!id) notFound()

  const product = await getProduct(params.category, id)
  if (!product) notFound()

  return <ProductView product={product} />
}

// Página principal
export default async function Page({ params }: PageProps) {
  // Resolvemos la promesa de params
  const resolvedParams = await params

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div>Cargando...</div>
        </div>
      }
    >
      <ProductLoader params={resolvedParams} />
    </Suspense>
  )
}

// Metadatos
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params

  try {
    const id = extractIdFromSlug(params.slug)
    if (!id) {
      return { title: 'Producto no encontrado' }
    }

    const product = await getProduct(params.category, id)
    if (!product) {
      return { title: 'Producto no encontrado' }
    }

    return {
      title: `${product.name} | ${product.categoryName}`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [{ url: product.image }]
      }
    }
  } catch {
    return {
      title: 'Error',
      description: 'Ha ocurrido un error al cargar el producto'
    }
  }
}