import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Star } from 'lucide-react'
import { slugify } from '@/lib/utils'
import { Product } from '@/lib/types'
import { useState } from 'react'

type ProductCardProps = Omit<Product, 'orderItems' | 'createdAt' | 'updatedAt'>

export default function ProductCard({ 
  id, 
  name, 
  image, 
  price, 
  category, 
  featured 
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const slug = `${slugify(name)}-${id}`
  const href = `/categories/${category}/${slug}`

  return (
    <Link href={href} className="block w-full">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full">
        <CardContent className="p-0">
          <div className="aspect-square relative w-full bg-gray-100">
            <Image
              src={image}
              alt={name}
              fill
              className={`
                object-cover duration-700 ease-in-out
                ${isLoading 
                  ? 'scale-110 blur-2xl grayscale'
                  : 'scale-100 blur-0 grayscale-0'
                }
              `}
              sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              priority={false}
              onLoad={(event) => {
                const img = event.target as HTMLImageElement
                if (img.src.indexOf('data:image') < 0) {
                  setIsLoading(false)
                }
              }}
            />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <h3 className="font-medium line-clamp-1">{name}</h3>
              {featured && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Producto favorito de los clientes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="mt-1 text-primary font-bold">
              ${price.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}