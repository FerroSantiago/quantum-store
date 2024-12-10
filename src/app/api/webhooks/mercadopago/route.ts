import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { paymentClient } from '@/lib/mercadopago';
import { PaymentStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.type === 'payment') {
      const paymentInfo = await paymentClient.get({ id: body.data.id });
      
      if (!paymentInfo.external_reference) {
        throw new Error('No external reference found');
      }

      let paymentStatus: PaymentStatus;
      switch (paymentInfo.status) {
        case 'approved':
          paymentStatus = 'APPROVED';
          break;
        case 'rejected':
          paymentStatus = 'REJECTED';
          break;
        default:
          paymentStatus = 'PENDING';
      }

      await prisma.payment.update({
        where: { id: paymentInfo.external_reference },
        data: {
          status: paymentStatus,
          payment_id: paymentInfo.id?.toString(),
          merchant_order_id: paymentInfo.order?.id?.toString()
        }
      });

      if (paymentStatus === 'APPROVED') {
        const payment = await prisma.payment.findUnique({
          where: { id: paymentInfo.external_reference }
        });

        if (payment) {
          await prisma.order.update({
            where: { id: payment.orderId },
            data: { status: 'COMPLETED' }
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}