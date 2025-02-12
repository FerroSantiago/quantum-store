import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    console.log('🔍 Fetching payment:', id);

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: true
              }
            },
            user: true,
          }
        }
      }
    });

    if (!payment) {
      console.log('❌ Payment not found:', id);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    console.log('✅ Payment found:', payment);
    return NextResponse.json(payment);
  } catch (error) {
    console.error('❌ Error fetching payment:', error);
    return NextResponse.json(
      { error: 'Error fetching payment details' },
      { status: 500 }
    );
  }
}