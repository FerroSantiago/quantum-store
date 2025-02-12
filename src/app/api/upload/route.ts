import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { extname } from "path";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const address = formData.get("address") as string;
    const billType = formData.get("billType") as string;

    if (!file || !userId || !address || !billType) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
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

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    /*
    const total = cartItems.reduce((acc, item) => acc + item.product.price, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: total,
        status: "PENDING",
        notes: `Factura: ${billType} | Dirección: ${address} | Comprobante: ${fileUrl}`,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    });
    */

    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error("Upload error", error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
};