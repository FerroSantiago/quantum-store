/*
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { paymentClient } from '@/lib/mercadopago';
import { PaymentStatus } from '@prisma/client';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

function validateWebhookSignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string,
  secret: string
): boolean {
  if (!xSignature) return false;

  // Separar ts y v1 del x-signature
  const parts = xSignature.split(',');
  let ts = '';
  let hash = '';

  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key?.trim() === 'ts') ts = value.trim();
    if (key?.trim() === 'v1') hash = value.trim();
  });

  if (!ts || !hash) return false;

  // Construir el manifest string
  const manifestParts = [`id:${dataId}`];
  if (xRequestId) manifestParts.push(`request-id:${xRequestId}`);
  manifestParts.push(`ts:${ts}`);
  const manifest = manifestParts.join(';') + ';';

  // Generar HMAC
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(manifest);
  const calculatedHash = hmac.digest('hex');

  return calculatedHash === hash;
}

export async function POST(request: Request) {
  console.log('💰 Webhook received at:', new Date().toISOString());
  try {
    const rawBody = await request.text();
    console.log('📦 Raw webhook body:', rawBody);
    
    const body = JSON.parse(rawBody);
    console.log('📦 Parsed webhook body:', body);

    const xSignature = request.headers.get('x-signature');
    const xRequestId = request.headers.get('x-request-id');

    // Validar que sea un evento de pago
    if (body.type !== 'payment' || !body.data?.id) {
      console.log('❌ Invalid webhook data:', body);
      return NextResponse.json({
        success: false,
        error: 'Invalid webhook data'
      }, { status: 200 });
    }
 
    // Validar firma en producción
    if (process.env.NODE_ENV === 'production') {
      console.log('🔐 Validating signature...');
      const isValid = validateWebhookSignature(
        xSignature,
        xRequestId,
        body.data.id,
        process.env.DEV_MERCADOPAGO_WEBHOOK_SECRET_KEY!
      );
 
      if (!isValid) {
        console.error('❌ Invalid signature');
        return NextResponse.json({
          success: false,
          error: 'Invalid signature'
        }, { status: 401 });
      }
      console.log('✅ Signature validated successfully');
    }
 
    // Obtener detalles del pago
    console.log('🔍 Fetching payment details from MP...');
    const paymentInfo = await paymentClient.get({ id: body.data.id });
    console.log('📝 Payment info from MP:', paymentInfo);
 
    if (!paymentInfo.external_reference) {
      console.error('❌ No external reference found in payment info');
      throw new Error('No external reference found');
    }
 
    // Buscar el pago en nuestra base de datos
    console.log('🔍 Looking for payment in database:', paymentInfo.external_reference);
    const existingPayment = await prisma.payment.findFirst({
      where: {
        OR: [
          { id: paymentInfo.external_reference },
          ...(paymentInfo.id ? [{ payment_id: paymentInfo.id.toString() }] : [])
        ]
      }
    });
 
    if (!existingPayment) {
      console.error('❌ Payment not found in database');
      return NextResponse.json({ 
        error: 'Payment not found' 
      }, { status: 404 });
    }
    console.log('📝 Payment before update:', existingPayment);
 
    // Determinar estado del pago
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
    console.log('✨ Updating payment to status:', paymentStatus);
 
    // Actualizar el pago
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentInfo.external_reference },
      data: {
        status: paymentStatus,
        payment_id: paymentInfo.id?.toString(),
        merchant_order_id: paymentInfo.order?.id?.toString()
      }
    });
    console.log('✅ Payment updated:', updatedPayment);
 
    return NextResponse.json({ 
      success: true,
      status: paymentStatus,
      paymentId: updatedPayment.id
    });
 
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
 }

 */