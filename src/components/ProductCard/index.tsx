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

interface ProductCardProps {
  id: string
  name: string
  image: string
  price: number
  href: string
  featured?: boolean
}

export default function ProductCard({ name, image, price, href, featured }: ProductCardProps) {
  return (
    <Link href={href} className="block w-fit mx-auto">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <CardContent className="p-0">
          <div className="aspect-square relative w-[300px] h-[300px]">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{name}</h3>
              {featured && (
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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