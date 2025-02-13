"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Order, PaymentStatus } from "@/lib/types";
import { Loader2 } from "lucide-react";

const PaymentStatusConfig = {
  PENDING: { label: "Pendiente", style: "text-yellow-600" },
  PARTIALLY_PAID: { label: "Pago parcial", style: "text-orange-600" },
  COMPLETED: { label: "Pago completado", style: "text-green-600" },
  REJECTED: { label: "Rechazado", style: "text-red-600" },
} as const;

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data);
        } else {
          console.error("Error al obtener la orden", data.error);
        }
      } catch (error) {
        console.error("Error de red", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-center mt-10">Orden no encontrada</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Orden #{order.id.slice(-8).toUpperCase()}
      </h1>
      <p className="text-gray-600">
        Estado: <span className="font-semibold">{order.status}</span>
      </p>

      {/* Productos */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Productos comprados</h2>
        <ul className="border rounded-lg p-4 mt-2">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-2">
              <span>{item.product.name} x{item.quantity}</span>
              <span>${(item.quantity * item.price).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagos */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Pagos</h2>
        {order.payments.length > 0 ? (
          <ul className="border rounded-lg p-4 mt-2">
            {order.payments.map((payment, index) => {
              const config = PaymentStatusConfig[payment.status as PaymentStatus] || PaymentStatusConfig.PENDING;

              return (
                <li key={index} className="flex justify-between items-center py-2">
                  <span className={`text-sm font-medium ${config.style}`}>
                    {config.label}
                  </span>
                  {payment.receiptURL && (
                    <button
                      onClick={async () => {
                        const response = await fetch(`/api/admin/orders/${order.id}/payments`);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);

                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `recibo_${order.id}.pdf`; // Cambia la extensión según el tipo de archivo
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Descargar Recibo {index + 1}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">No hay pagos registrados</p>
        )}
      </div>
    </div>
  );
}
