import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 🔹 GET: Obtener detalles de la orden
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        payments: true,
        orderEvents: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    return NextResponse.json({ error: "Error fetching order details" }, { status: 500 });
  }
}

// 🔹 PATCH: Actualizar estado de la orden
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await req.json();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        orderEvents: {
          create: {
            status,
            createdBy: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("❌ Error updating order:", error);
    return NextResponse.json({ error: "Error updating order" }, { status: 500 });
  }
}
