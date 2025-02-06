import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrdersTable from "@/components/admin/OrdersTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { OrderStatus } from "@/lib/types";

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const rawOrders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
      orderEvents: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convertir las fechas a string
  const orders = rawOrders.map((order) => ({
    ...order,
    status: order.status as OrderStatus,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    payment: order.payment
      ? {
        ...order.payment,
        createdAt: order.payment.createdAt.toISOString(),
        updatedAt: order.payment.updatedAt.toISOString(),
      }
      : null,
    orderEvents: order.orderEvents.map((event) => ({
      ...event,
      createdAt: event.createdAt.toISOString(),
    })),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestión de Órdenes</h1>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por ID, email o tracking..."
            className="pl-10"
          />
        </div>
      </div>
      <OrdersTable initialOrders={orders} />
    </div>
  );
}
