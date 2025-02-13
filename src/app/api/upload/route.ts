import { NextRequest, NextResponse } from "next/server";
import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { extname, parse } from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const address = formData.get("address") as string;
    const billType = formData.get("billType") as string;
    const amountPaid = parseFloat(formData.get("amountPaid") as string);

    if (!file || !userId || !address || !billType || isNaN(amountPaid) || amountPaid <= 0) {
      return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
    }

    //Generar nombre unico para el archivo
    const fileExtension = extname(file.name);
    const uniqueName = `${crypto.randomUUID()}${fileExtension}`;
    const key = `comprobantes/${uniqueName}`;

    //Convertir el archivo a un buffer para subirlo
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    //Subir el archivo a S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type
    }));

    const fileUrl = key;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.product.price ?? 0), 0);

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: "PENDING",
        notes: `Factura: ${billType} | Dirección: ${address}`,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        },
        payments: {
          create: {
            amountPaid,
            status: amountPaid >= totalAmount ? "COMPLETED" : "PARTIALLY_PAID",
            receiptURL: fileUrl
          }
        }
      },
      include: {
        payments: true,
      },
    });

    //LimpiarCarrito
    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    return NextResponse.json({ orderId: order.id, fileUrl });
  } catch (error) {
    console.error("Upload error", error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
};