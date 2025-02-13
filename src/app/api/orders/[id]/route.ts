import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id, userId: session.user.id, },
      include: {
        items: { include: { product: true, }, },
        payments: true,
        orderEvents: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    //Generar URL firmada si hay un recibo
    const signedUrls = await Promise.all(
      order.payments.map(async (payment) => {
        if (!payment.receiptURL) return null;
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: payment.receiptURL,
        });

        return {
          id: payment.id,
          amount: payment.amountPaid,
          status: payment.status,
          signedUrl: await getSignedUrl(s3, command, { expiresIn: 3600 }),
        }
      })
    );

    return NextResponse.json({
      ...order,
      payments: signedUrls.filter((url) => url !== null),
    });

  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Error fetching order details" },
      { status: 500 }
    );
  }
}
