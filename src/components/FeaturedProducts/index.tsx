'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'

interface Product {
  id: string
  name: string
  image: string
  price: number
  category: string
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const [productsData, setProductsData] = useState<Product[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'center',
    containScroll: false,
    loop: true
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      const resolvedProducts = await products
      setProductsData(resolvedProducts)
    }
    loadProducts()
  }, [products])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  if (!productsData.length) {
    return null // o un componente de carga
  }

  return (
    <div>
      {isMobile ? (
        <>
          <div className="overflow-hidden -mx-4" ref={emblaRef}>
            <div className="flex px-4">
              {productsData.map((product) => (
                <div key={product.id} className="flex-[0_0_100%] flex justify-center px-4">
                  <div className="w-full max-w-sm">
                    <ProductCard 
                      {...product}
                      href={`/categories/${product.category}/${product.id}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {productsData.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all border ${
                  index === selectedIndex 
                    ? 'border-primary bg-transparent' 
                    : 'border-gray-300 bg-gray-300'
                }`}
                aria-label={`Ir al producto ${index + 1}`}
                onClick={() => emblaApi?.scrollTo(index)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsData.map((product) => (
            <ProductCard 
              key={product.id} 
              {...product} 
              href={`/categories/${product.category}/${product.id}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}