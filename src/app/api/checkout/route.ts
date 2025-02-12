import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
// import { preferenceClient } from '@/lib/mercadopago'; Comentado MercadoPago

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true }
    });

    if (!cartItems.length) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    const total = cartItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount: total,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amountPaid: total,
        status: 'PENDING'
      }
    });

    /* Código de MercadoPago comentado
    const preference = await preferenceClient.create({
      body: {
        items: cartItems.map(item => ({
          id: item.product.id,
          title: item.product.name,
          quantity: item.quantity,
          currency_id: 'ARS',
          unit_price: item.product.price
        })),
        back_urls: {
          success: `${process.env.NEXTAUTH_URL}/checkout/success`,
          failure: `${process.env.NEXTAUTH_URL}/checkout/failure`,
        },
        external_reference: payment.id,
        auto_return: 'approved',
        notification_url: `${process.env.NEXTAUTH_URL}/api/webhooks/mercadopago`,
      }
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { 
        preference_id: preference.id,
      }
    });
    */

    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id }
    });

    return NextResponse.json({
      // preferenceId: preference.id  Comentado para evitar dependencia de MercadoPago
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Error processing checkout' },
      { status: 500 }
    );
  }
}
