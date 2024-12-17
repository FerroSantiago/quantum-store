import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { status } = await request.json();

    const order = await prisma.order.update({
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
      include: {
        items: {
          include: {
            product: true
          }
        },
        payment: true,
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Error updating order" },
      { status: 500 }
    );
  }
}
