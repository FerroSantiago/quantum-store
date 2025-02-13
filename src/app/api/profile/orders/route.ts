import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Buscar la orden en la base de datos con los pagos asociados
    const order = await prisma.order.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    // Verificar si el usuario es dueño de la orden
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // Obtener el primer recibo de pago disponible
    const receipt = order.payments.find((payment) => payment.receiptURL);
    if (!receipt) {
      return NextResponse.json({ error: "No hay comprobantes disponibles" }, { status: 404 });
    }

    // Generar URL firmada
    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: receipt.receiptURL!,
      }),
      { expiresIn: 3600 }
    );

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Error al obtener el recibo:", error);
    return NextResponse.json({ error: "Error al obtener el recibo" }, { status: 500 });
  }
}
