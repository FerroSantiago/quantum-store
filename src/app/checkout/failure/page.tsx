"use client";

import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutFailurePage() {
  const searchParams = useSearchParams();
  const error =
    searchParams.get("error") || "Hubo un problema al procesar tu pago";

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-lg mx-auto p-6">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Error en el Pago</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-4">
            <Link
              href="/cart"
              className="block w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors"
            >
              Volver al carrito
            </Link>
            <Link
              href="/"
              className="block w-full border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
