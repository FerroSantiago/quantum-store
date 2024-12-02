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

interface ProductCardProps {
  id: string
  name: string
  image: string
  price: number
  category: string
  featured?: boolean
}

export default function ProductCard({ name, image, price, category, id, featured }: ProductCardProps) {
  // Solo usamos el nombre del producto para la parte legible del slug
  const slug = `${slugify(name)}-${id}`

  return (
    <Link href={`/categories/${category}/${slug}`} className="block w-full">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full">
        <CardContent className="p-0">
          <div className="aspect-square relative w-full">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
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