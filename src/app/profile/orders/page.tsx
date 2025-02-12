"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Order } from "@/lib/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/profile/orders");
        if (!response.ok) {
          throw new Error("Error al cargar las órdenes");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <p className="text-red-500 text-center">{error}</p>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Mis Órdenes</h1>
          <p className="mb-4">No tienes órdenes realizadas</p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Ir a comprar
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Órdenes</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <p className="font-medium">
                  Orden #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                <p className="font-medium">Total: ${order.totalAmount.toFixed(2)}</p>
                <p className="text-sm">
                  Estado:{" "}
                  <span
                    className={`font-medium ${order.status === "COMPLETED"
                      ? "text-green-600"
                      : order.status === "CANCELLED"
                        ? "text-red-600"
                        : "text-blue-600"
                      }`}
                  >
                    {order.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Productos:</h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>
                      {item.product.name} x{item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {order.payments && order.payments.length > 0 && (
              <div className="border-t mt-4 pt-4 text-sm">
                <p>
                  Estado del pago:{" "}
                  <span
                    className={`font-medium ${order.payments.some((p) => p.status === "REJECTED")
                        ? "text-red-600"
                        : order.payments.some((p) => p.status === "PARTIALLY_PAID")
                          ? "text-yellow-600"
                          : order.payments.every((p) => p.status === "COMPLETED")
                            ? "text-green-600"
                            : "text-gray-600"
                      }`}
                  >
                    {order.payments.some((p) => p.status === "REJECTED")
                      ? "REJECTED"
                      : order.payments.some((p) => p.status === "PARTIALLY_PAID")
                        ? "PARTIALLY PAID"
                        : order.payments.every((p) => p.status === "COMPLETED")
                          ? "COMPLETED"
                          : "PENDING"}
                  </span>
                </p>

                {/* Mostrar ID de cada pago si existe */}
                {order.payments.map((payment) => (
                  payment.receiptURL && (
                    <p key={payment.id} className="text-gray-500">
                      Comprobante:{" "}
                      <a href={payment.receiptURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Ver comprobante
                      </a>
                    </p>
                  )
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Link
                href={`/profile/orders/${order.id}`}
                className="text-primary hover:underline text-sm"
              >
                Ver detalles
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
