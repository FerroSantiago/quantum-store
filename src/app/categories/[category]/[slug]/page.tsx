import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import AddToCartButton from '@/components/AddToCartButton'
import { getProduct } from '@/lib/actions'
import { extractIdFromSlug } from '@/lib/utils'

type PageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function ProductPage(props: PageProps) {
  const params = await props.params
  
  try {
    const id = extractIdFromSlug(params.slug)
    if (!id) {
      console.error('ID no encontrado en el slug')
      notFound()
    }

    const product = await getProduct(params.category, id)
    if (!product) {
      console.error('Producto no encontrado')
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square relative w-full max-w-[300px] mx-auto">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                  sizes="300px"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div>
                  <p className="text-sm text-gray-500 mb-2">{product.categoryName}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    {product.featured && (
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <p className="text-2xl font-bold text-primary mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-gray-600">{product.description}</p>
                </div>
                <div className="flex justify-end mt-6">
                  <AddToCartButton product={product} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Error al obtener el producto:', error)
    notFound()
  }
}