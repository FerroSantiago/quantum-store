import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ id: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function PATCH(
  req: NextRequest,
  context: Context
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await req.json();
    // Esperamos a que se resuelvan los params
    const params = await context.params;
    const { id } = params;

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