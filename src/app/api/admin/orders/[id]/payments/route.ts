import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

// 🔹 GET: Descargar el recibo de pago
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const payment = await prisma.payment.findFirst({
      where: { orderId: id },
    });

    if (!payment || !payment.receiptURL) {
      return NextResponse.json({ error: "Recibo no encontrado" }, { status: 404 });
    }

    // Obtener el archivo de S3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: payment.receiptURL,
    });

    const response = await s3.send(command);

    if (!response.Body) {
      return NextResponse.json({ error: "Error al obtener el recibo" }, { status: 500 });
    }

    // Convertir el archivo a un Buffer
    const fileBuffer = await response.Body.transformToByteArray();

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${payment.receiptURL.split("/").pop()}"`,
      },
    });

  } catch (error) {
    console.error("❌ Error al obtener el recibo:", error);
    return NextResponse.json({ error: "Error al obtener el recibo" }, { status: 500 });
  }
}

// 🔹 PATCH: Actualizar estado del pago
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

    const updatedPayment = await prisma.payment.updateMany({
      where: { orderId: id },
      data: { status },
    });

    if (updatedPayment.count === 0) {
      return NextResponse.json({ error: "No se encontró el pago" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error updating payment:", error);
    return NextResponse.json({ error: "Error updating payment" }, { status: 500 });
  }
}
