"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  ArrowLeft,
  Package,
  CreditCard,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface OrderDetail {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    product: {
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
    price: number;
  }>;
  payment: {
    id: string;
    status: string;
    payment_id: string | null;
    preference_id: string | null;
    merchant_order_id: string | null;
    amount: number;
    createdAt: string;
  } | null;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetail() {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        if (!response.ok) {
          throw new Error("Error al cargar los detalles de la orden");
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchOrderDetail();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              {error || "Orden no encontrada"}
            </p>
            <button
              onClick={() => router.push("/profile/orders")}
              className="flex items-center justify-center gap-2 mx-auto text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a mis órdenes
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Link
          href="/profile/orders"
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a mis órdenes
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Detalles principales de la orden */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">
              Orden #{order.id.slice(-8).toUpperCase()}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <p
                    className={`font-medium ${
                      order.status === "COMPLETED"
                        ? "text-green-600"
                        : order.status === "CANCELLED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="font-semibold mb-4">Productos</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="(max-width: 768px) 100px, 200px"
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Información del pago */}
        <div>
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Información del Pago</h2>
            {order.payment ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Estado del pago</p>
                  <p
                    className={`font-medium ${
                      order.payment.status === "APPROVED"
                        ? "text-green-600"
                        : order.payment.status === "REJECTED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.payment.status}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Monto</p>
                  <p className="font-medium">
                    ${order.payment.amount.toFixed(2)}
                  </p>
                </div>

                {order.payment.payment_id && (
                  <div>
                    <p className="text-sm text-gray-500">ID de Pago</p>
                    <p className="font-medium">{order.payment.payment_id}</p>
                  </div>
                )}

                {order.payment.merchant_order_id && (
                  <div>
                    <p className="text-sm text-gray-500">ID de Orden</p>
                    <p className="font-medium">
                      {order.payment.merchant_order_id}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Fecha de pago</p>
                  <p className="font-medium">
                    {new Date(order.payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                No hay información de pago disponible
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
