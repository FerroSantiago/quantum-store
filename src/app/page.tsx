import FeaturedProducts from '@/components/FeaturedProducts'
import { getFeaturedProducts } from '@/lib/actions'

export default async function Home() {
  const products = getFeaturedProducts()
  
  return (
    <div className="container mx-auto px-4 py-12">
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold inline-block relative">
            DESTACADOS DEL MES
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full" />
          </h2>
        </div>
        <FeaturedProducts products={products} />
      </section>
    </div>
  )
}