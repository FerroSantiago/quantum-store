"use client";

import Image from "next/image";
import { Star, DollarSign, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AddToCartButton from "@/components/AddToCartButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { UserStatus } from "@prisma/client";

interface ProductViewProps {
  product: Product;
}

export default function ProductView({ product }: ProductViewProps) {
  const { data: session, status: authStatus } = useSession();

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Imagen */}
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

            {/* Contenido */}
            <div className="flex flex-col h-full">
              {/* Información del producto */}
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">
                  {product.categoryName}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  {product.featured && (
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Precio y botón */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between gap-4">
                  {authStatus === "authenticated" ? (
                    session?.user?.status === UserStatus.APPROVED ? (
                      <>
                        <p className="text-2xl font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </p>
                        <AddToCartButton product={product} />
                      </>
                    ) : (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <div className="text-muted-foreground">
                              Aprobación pendiente para ver precios
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Espere la aprobación del administrador</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  ) : (
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 text-xl text-muted-foreground hover:text-primary transition-colors"
                          >
                            <DollarSign className="h-6 w-6" />
                            <Eye
                              className="h-6 w-6"
                              style={{ textDecoration: "line-through" }}
                            />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Inicia sesión para ver el precio</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
