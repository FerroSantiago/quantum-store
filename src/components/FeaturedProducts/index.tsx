'use client'

'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'

interface FeaturedProductsProps {
  products: Product[]
}

type ScreenSize = 'mobile' | 'tablet' | 'desktop' | 'large'

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [productsData, setProductsData] = useState<Product[]>([])
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop')
  const [currentPage, setCurrentPage] = useState(0)
  
  const getSlidesPerView = useCallback(() => {
    switch (screenSize) {
      case 'mobile': return 1
      case 'tablet': return 2
      case 'desktop': return 3
      case 'large': return 4
      default: return 4
    }
  }, [screenSize])

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'keepSnaps', // Cambiado para evitar repetición
    loop: false, // Desactivado el loop
    slidesToScroll: getSlidesPerView()
  })

  useEffect(() => {
    const loadProducts = async () => {
      const resolvedProducts = await products
      setProductsData(resolvedProducts)
    }
    loadProducts()
  }, [products])

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width < 640) setScreenSize('mobile')
      else if (width < 768) setScreenSize('tablet')
      else if (width < 1024) setScreenSize('desktop')
      else setScreenSize('large')
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      const slidesPerView = getSlidesPerView()
      const currentSlide = emblaApi.selectedScrollSnap()
      const totalGroups = Math.ceil(productsData.length / slidesPerView)
      const currentGroup = Math.min(Math.floor(currentSlide / slidesPerView), totalGroups - 1)
      setCurrentPage(currentGroup)
    }

    onSelect()
    emblaApi.on('select', onSelect)
    
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, getSlidesPerView, productsData.length])

  if (!productsData.length) {
    return (
      <div className="animate-pulse">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-[400px] bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  const slidesPerView = getSlidesPerView()
  const totalGroups = Math.ceil(productsData.length / slidesPerView)

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {productsData.map((product) => (
            <div 
              key={product.id} 
              className="flex-none pl-4"
              style={{ width: `${100 / slidesPerView}%` }}
            >
              <div className="mr-4">
                <ProductCard {...product} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(totalGroups)].map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all border ${
              index === currentPage
                ? 'border-primary bg-primary' 
                : 'border-gray-300 bg-gray-300'
            }`}
            aria-label={`Ir al grupo ${index + 1}`}
            onClick={() => emblaApi?.scrollTo(index * slidesPerView)}
          />
        ))}
      </div>

      {screenSize !== 'mobile' && totalGroups > 1 && (
        <>
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Anterior grupo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Siguiente grupo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  )
}