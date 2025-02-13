"use client";

import { useCallback, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Order, OrderStatus, PaymentStatus } from "@/lib/types";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";

export default function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState<string | null>(null);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search")?.toLowerCase();

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm) ||
        order.user.email.toLowerCase().includes(searchTerm) ||
        (order.user.name?.toLowerCase() || "").includes(searchTerm)
    );
  }, [orders, searchTerm]);

  const handleOrderStatusUpdate = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingOrder(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la orden");
      }

      setOrders((orders) =>
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success("Estado del pedido actualizado");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast.error(errorMessage);
    } finally {
      setIsUpdatingOrder(null);
    }
  }, []);

  const handlePaymentStatusUpdate = async (orderId: string, newStatus: PaymentStatus) => {
    setIsUpdatingPayment(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/payments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el pago");
      }

      setOrders((orders) =>
        orders.map((order) =>
          order.id === orderId
            ? {
              ...order,
              payments: order.payments.map((p) => ({
                ...p,
                status: newStatus as PaymentStatus,
              })),
            }
            : order
        )
      );

      toast.success("Estado del pago actualizado");
    } catch (error) {
      console.error("Error updating payment:", error);
    } finally {
      setIsUpdatingPayment(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      {filteredOrders.length === 0 ? (
        <p className="text-center py-4 text-muted-foreground">
          {searchTerm
            ? "No se encontraron órdenes que coincidan con la búsqueda"
            : "No hay órdenes registradas"}
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-bz">
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Cliente</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Estado</th>
              <th className="text-left p-4">Pago</th>
              <th className="text-left p-4">Recibos</th>
              <th className="text-left p-4">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              return (
                <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-4 font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-primary hover:underline">
                      #{order.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="p-4">
                    <div>
                      <p>{order.user.name || "N/A"}</p>
                      <p className="text-sm text-gray-500">{order.user.email}</p>
                    </div>
                  </td>
                  <td className="p-4">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <Select
                      value={order.status}
                      onValueChange={(newStatus) => handleOrderStatusUpdate(order.id, newStatus as OrderStatus)}
                      disabled={isUpdatingOrder === order.id}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(OrderStatus).map(([value]) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">
                    <Select
                      value={order.payments[0]?.status || "PENDING"}
                      onValueChange={(newStatus) => handlePaymentStatusUpdate(order.id, newStatus as PaymentStatus)}
                      disabled={isUpdatingPayment === order.id}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="PARTIALLY_PAID">Pago Parcial</SelectItem>
                        <SelectItem value="COMPLETED">Completado</SelectItem>
                        <SelectItem value="REJECTED">Rechazado</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">
                    {order.payments?.map((payment, index) =>
                      payment.receiptURL ? (
                        <Link
                          key={index}
                          href={`/api/admin/orders/${order.id}/payments`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline block"
                        >
                          Recibo {index + 1}
                        </Link>
                      ) : (
                        <span key={index} className="text-gray-500">Sin recibo</span>
                      )
                    )}
                  </td>
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
