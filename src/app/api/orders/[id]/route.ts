import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Context = {
  params: { id: string };
};

export async function GET(
  req: NextRequest,
  context: Context
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = context.params;

    const order = await prisma.order.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
        orderEvents: {
          orderBy: { createdAt: "desc" },
        }
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Error fetching order details" },
      { status: 500 }
    );
  }
}
