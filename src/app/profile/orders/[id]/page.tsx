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
import { FileText } from "lucide-react";

interface OrderDetail {
  id: string;
  totalAmount: number;
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
  payments: Array<{
    id: string;
    status: string;
    amountPaid: number;
    receiptURL: string | null;
    createdAt: string;
  }>;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signedReceipts, setSignedReceipts] = useState<{ [key: string]: string }>({});

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

  // Obtener los Signed URLs de los recibos
  useEffect(() => {
    async function fetchSignedUrls() {
      if (!order?.payments) return;
      const urls: { [key: string]: string } = {};

      for (const payment of order.payments) {
        if (payment.receiptURL) {
          try {
            const res = await fetch(`/api/profile/orders/${params.id}/receipt`);
            if (res.ok) {
              const data = await res.json();
              urls[payment.id] = data.url;
            }
          } catch (err) {
            console.error(`Error al obtener el recibo ${payment.id}`, err);
          }
        }
      }
      setSignedReceipts(urls);
    }

    if (order) {
      fetchSignedUrls();
    }
  }, [order, params.id]);


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
                  <p className={`font-medium ${order.status === "COMPLETED" ? "text-green-600" : order.status === "CANCELLED" ? "text-red-600" : "text-yellow-600"}`}>
                    {order.status}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="font-semibold mb-4">Productos</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <Image src={item.product.image} alt={item.product.name} fill sizes="(max-width: 768px) 100px, 200px" className="object-cover rounded" />
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
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
            {order.payments.map((payment) => (
              <div key={payment.id} className="space-y-4 border-b pb-4">
                <p className="text-sm text-gray-500">Estado del pago: <span className="font-medium">{payment.status}</span></p>
                <p className="text-sm text-gray-500">Monto: <span className="font-medium">${payment.amountPaid.toFixed(2)}</span></p>
                {signedReceipts[payment.id] && (
                  <Link href={signedReceipts[payment.id]} target="_blank" className="text-primary flex items-center gap-2 hover:underline">
                    <FileText className="h-5 w-5" />
                    Ver comprobante
                  </Link>
                )}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}