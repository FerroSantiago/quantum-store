"use client";

import { useCallback, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Order, OrderStatus } from "@/lib/types";
import { Package, Truck, CheckCircle, XCircle, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const OrderStatusConfig = {
  PENDING: {
    label: "Pendiente",
    style: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  PROCESSING: {
    label: "Procesando",
    style: "bg-blue-100 text-blue-800",
    icon: Package,
  },
  SHIPPED: {
    label: "Enviado",
    style: "bg-purple-100 text-purple-800",
    icon: Truck,
  },
  DELIVERED: {
    label: "Entregado",
    style: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  COMPLETED: {
    label: "Completado",
    style: "bg-gray-100 text-gray-800",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelado",
    style: "bg-red-100 text-red-800",
    icon: XCircle,
  },
} as const;

export default function OrdersTable({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search")?.toLowerCase();

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;

    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm) ||
        order.user.email.toLowerCase().includes(searchTerm) ||
        (order.trackingNumber?.toLowerCase() || "").includes(searchTerm) ||
        (order.user.name?.toLowerCase() || "").includes(searchTerm)
    );
  }, [orders, searchTerm]);

  const handleStatusUpdate = useCallback(
    async (orderId: string, newStatus: OrderStatus) => {
      setIsUpdating(orderId);
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) throw new Error("Error al actualizar");

        setOrders((orders) =>
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );

        toast.success("Estado actualizado");
      } catch {
        toast.error("Error al actualizar");
      } finally {
        setIsUpdating(null);
      }
    },
    [setOrders]
  );

  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const config = OrderStatusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.style}`}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {config.label}
      </span>
    );
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
              <th className="text-left p-4">Tracking</th>
              <th className="text-left p-4">Fecha</th>
              <th className="text-right p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                <td className="p-4 font-medium">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="hover:text-primary hover:underline"
                  >
                    #{order.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="p-4">
                  <div>
                    <p>{order.user.name || "N/A"}</p>
                    <p className="text-sm text-gray-500">{order.user.email}</p>
                  </div>
                </td>
                <td className="p-4">${order.total.toFixed(2)}</td>
                <td className="p-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.payment?.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {order.payment?.status || "N/A"}
                  </span>
                </td>
                <td className="p-4">{order.trackingNumber || "No asignado"}</td>
                <td className="p-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <select
                      className="p-2 border border-border rounded-md bg-background"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(
                          order.id,
                          e.target.value as OrderStatus
                        )
                      }
                      disabled={isUpdating === order.id}
                    >
                      {Object.entries(OrderStatusConfig).map(
                        ([value, { label }]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                    {isUpdating === order.id && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
