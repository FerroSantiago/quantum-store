"use client";

import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const router = useRouter();

  /*
  useEffect(() => {
    // Cargar el script de MercadoPago
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.type = "text/javascript";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const handleCheckout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Error al procesar la peticion");
      }

      const { preferenceId } = await response.json();

      *if (!window.MercadoPago) {
        throw new Error("MercadoPago SDK no está cargado");
      }

      const mp = new window.MercadoPago(
        process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!,
        {
          locale: "es-AR",
        }
      );

      mp.checkout({
        preference: {
          id: preferenceId,
        },
        render: {
          container: ".cho-container",
          label: "Pagar ahora",
          type: "wallet",
        },
      });
    } catch (error) {
      toast.error("Error al iniciar el checkout");
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  */

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
        <div className="mt-[150px] text-center">
          <p className="text-2xl mb-4">No hay items en el carrito</p>
          <button
            onClick={() => router.push("/")}
            className="text-xl px-6 py-2 rounded-md hover:bg-border transition-colors"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Lista de productos */}
        <div className="md:col-span-2">
          {items.map((item) => (
            <Card key={item.id} className="mb-4 p-4">
              <div className="flex gap-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="(max-width: 768px) 100px, 200px"
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">
                    ${item.product.price.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="mx-2">{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto p-1 hover:bg-gray-100 rounded text-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Resumen y checkout */}
        <div>
          <Card className="p-4 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>

              <div className="cho-container">
                {/* Botón para redirigir a la nueva página de orden */}
                <button
                  onClick={() => router.push("/cart/order")}
                  className="w-full bg-primary py-2 rounded-md hover:bg-border transition-colors disabled:opacity-50"
                >
                  Proceder con el pedido
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
